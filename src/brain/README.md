# src/brain — Recommendation & Guidance Engine

The brain is implemented as an **advisory engine**.

It does:

- normalize intake data;
- calculate age guidance;
- surface gate-related issues without deciding eligibility;
- rank all 45 routes internally;
- show the selected route and three alternatives;
- generate a route-specific document checklist;
- surface open risk flags;
- recommend the next professional action;
- emit a full audit trail.

It does **not**:

- tell a client that they are eligible or ineligible;
- automatically reject or close a case;
- replace the lawyer's judgment;
- treat an internal score as a legal decision;
- verify a locality without the official government calculator.

## API

```ts
import { runBrain } from '@/brain'
import type { CaseState } from '@/types/brain'

const output = runBrain(caseState)
```

The internal score is cockpit-only. Client-facing UI should use
`guidance`, `missingDocuments`, and approved explanatory text.
