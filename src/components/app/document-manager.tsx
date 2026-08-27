'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type DocumentRow = {
  id: string
  file_name: string
  storage_path: string
  review_status: string
  sensitivity: string
  uploaded_by: string | null
  created_at: string
}

type Props = {
  caseId: string
  userId: string
  initialDocuments: DocumentRow[]
}

const MAX_SIZE = 15 * 1024 * 1024
const ALLOWED = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export function DocumentManager({ caseId, userId, initialDocuments }: Props) {
  const supabase = createSupabaseBrowserClient()
  const [documents, setDocuments] = useState(initialDocuments)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function upload(file: File, sensitivity: string) {
    setMessage(null)
    if (!ALLOWED.has(file.type)) {
      setMessage('ניתן להעלות PDF, JPG או PNG בלבד.')
      return
    }
    if (file.size > MAX_SIZE) {
      setMessage('גודל הקובץ המרבי הוא 15MB.')
      return
    }

    setBusy(true)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${caseId}/${crypto.randomUUID()}-${safeName}`
    const uploadResult = await supabase.storage
      .from('rfl-case-documents')
      .upload(storagePath, file, { contentType: file.type, upsert: false })

    if (uploadResult.error) {
      setBusy(false)
      setMessage('העלאת הקובץ נכשלה. נסה שוב.')
      return
    }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: userId,
        sensitivity,
      })
      .select('id,file_name,storage_path,review_status,sensitivity,uploaded_by,created_at')
      .single()

    if (error || !data) {
      await supabase.storage.from('rfl-case-documents').remove([storagePath])
      setBusy(false)
      setMessage('הקובץ לא נרשם בתיק ולכן ההעלאה בוטלה.')
      return
    }

    setDocuments((current) => [data, ...current])
    setBusy(false)
    setMessage('המסמך נשמר בתיק.')
  }

  async function download(document: DocumentRow) {
    setMessage(null)
    const { data, error } = await supabase.storage
      .from('rfl-case-documents')
      .createSignedUrl(document.storage_path, 60)
    if (error || !data?.signedUrl) {
      setMessage('לא ניתן לפתוח את המסמך כרגע.')
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  async function remove(document: DocumentRow) {
    if (document.uploaded_by !== userId || document.review_status !== 'pending') {
      setMessage('ניתן למחוק רק מסמך שלך שטרם עבר בדיקה.')
      return
    }
    setBusy(true)
    const db = await supabase.from('documents').delete().eq('id', document.id)
    if (db.error) {
      setBusy(false)
      setMessage('מחיקת המסמך לא אושרה.')
      return
    }
    await supabase.storage.from('rfl-case-documents').remove([document.storage_path])
    setDocuments((current) => current.filter((item) => item.id !== document.id))
    setBusy(false)
    setMessage('המסמך נמחק.')
  }

  return (
    <section className="rounded-[28px] border border-[#dce4ee] bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
        <div>
          <label htmlFor="document-file" className="mb-2 block text-sm font-black">בחירת מסמך</label>
          <input id="document-file" type="file" accept="application/pdf,image/jpeg,image/png" disabled={busy} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </div>
        <div>
          <label htmlFor="document-sensitivity" className="mb-2 block text-sm font-black">סיווג</label>
          <select id="document-sensitivity" defaultValue="normal" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3">
            <option value="normal">רגיל</option>
            <option value="sensitive">רגיש</option>
            <option value="medical">רפואי</option>
          </select>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            const input = document.getElementById('document-file') as HTMLInputElement | null
            const sensitivity = document.getElementById('document-sensitivity') as HTMLSelectElement | null
            const file = input?.files?.[0]
            if (file) void upload(file, sensitivity?.value ?? 'normal')
          }}
          className="rounded-2xl bg-[#173b6d] px-6 py-3.5 font-black text-white disabled:opacity-50"
        >
          {busy ? 'מבצע…' : 'העלאה'}
        </button>
      </div>

      {message ? <p className="mt-4 rounded-xl bg-[#eef4fb] p-3 text-sm font-bold text-[#173b6d]" role="status">{message}</p> : null}

      <div className="mt-8 divide-y divide-slate-100">
        {documents.length ? documents.map((item) => (
          <article key={item.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-black">{item.file_name}</p>
              <p className="mt-1 text-xs text-slate-500">{item.sensitivity} · {item.review_status}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => void download(item)} className="rounded-xl border px-4 py-2 text-sm font-bold">הורדה</button>
              {item.uploaded_by === userId && item.review_status === 'pending' ? (
                <button type="button" disabled={busy} onClick={() => void remove(item)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700">מחיקה</button>
              ) : null}
            </div>
          </article>
        )) : <p className="py-10 text-center text-sm text-slate-500">אין מסמכים בתיק.</p>}
      </div>
    </section>
  )
}
