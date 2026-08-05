// Placeholder announcements used until the /news endpoint is wired up.
// Shape mirrors the Replit Announcement model (models.py) and the /news payload:
//   { id, title, body, type: 'info'|'update'|'warning'|'success',
//     pinned, active, publishedDate: 'YYYY-MM-DD', date: '02 Aug 2026' }
// `active` is admin-only — the public feed returns active announcements only.
export const MOCK_NEWS = [
  {
    id: 1,
    title: 'ROTEM Major Haemorrhage Pathway updated',
    body:
      'The non-obstetric ROTEM-guided major haemorrhage pathway has been revised in line with the 2025 departmental review.\n' +
      'Please review the updated fibrinogen triggers before your next on-call shift.',
    type: 'update',
    pinned: true,
    active: true,
    publishedDate: '2026-08-02',
    date: '02 Aug 2026',
  },
  {
    id: 2,
    title: 'Theatre 3 anaesthetic machine out of service',
    body:
      'Theatre 3 is out of service for planned servicing until Friday. Emergency lists have been redirected to Theatre 2.',
    type: 'warning',
    pinned: true,
    active: true,
    publishedDate: '2026-07-30',
    date: '30 Jul 2026',
  },
  {
    id: 3,
    title: 'Departmental teaching — Wednesday 08:00',
    body:
      'This week: paediatric airway management, presented by the anaesthetic registrars. Seminar Room B, breakfast provided.',
    type: 'info',
    pinned: false,
    active: true,
    publishedDate: '2026-07-28',
    date: '28 Jul 2026',
  },
  {
    id: 4,
    title: 'Antimicrobial stewardship audit — 100% compliance',
    body:
      'The Q2 surgical prophylaxis audit returned full compliance with the WGH stewardship guideline. Thank you all.',
    type: 'success',
    pinned: false,
    active: true,
    publishedDate: '2026-07-21',
    date: '21 Jul 2026',
  },
  {
    id: 5,
    title: 'New perioperative medication guidance (2024) now in app',
    body:
      'SGLT2 inhibitor and GLP-1 agonist stop/restart timings have been added to the Perioperative Medication section.',
    type: 'info',
    pinned: false,
    active: true,
    publishedDate: '2026-07-15',
    date: '15 Jul 2026',
  },
  {
    id: 6,
    title: 'Study day registration closes Friday',
    body:
      'Hidden example — this announcement is not visible on the home screen because it has been toggled off.',
    type: 'info',
    pinned: false,
    active: false,
    publishedDate: '2026-06-30',
    date: '30 Jun 2026',
  },
];
