# Step 5: Installation Tracking - Planning & Implementation

## Overview
Step 5 delivers real-time installation visibility for customers and contractors. It consumes Step 4 outputs (confirmed installation record, financing, checklist) and provides live progress, media, milestone tracking, inspections, and notifications.

## Goals
- Live progress and milestone visibility for both customer and contractor
- Photo/video evidence capture tied to updates and milestones
- Inspection scheduling/status tracking
- Push/real-time updates using Supabase Realtime and Storage
- Clear separation of contractor vs customer permissions

## Architecture
```
Installation Scheduled (Step 4)
        ↓
Installation Tracking Dashboard
├─ Live Progress & Milestones
├─ Updates Feed (notes/issues/photos)
├─ Photo Gallery (tagged by phase)
├─ Inspection Scheduling & Results
└─ Notifications (customer + contractor)
        ↓
Ready for Step 6 (Rebate Processing)
```

## Domain Model (existing tables to leverage)
- `installations` (002_pre_installation_phase): id, contract_id, customer_id, contractor_id, installation_date, time_window, duration, crew_size, instructions, status, confirmed_at, completed_at
- `installation_updates` (001_add_quotes_and_workflow_tables): id, installation_id, posted_by, update_type, title, description, photo_urls[], video_url, milestone_name, is_milestone, created_at
- `project_milestones` (001_add_quotes_and_workflow_tables): project-level milestones and status history
- `reviews` (extended in 001): already linked to installation_id for later Step 7

## Components to Build
1) `InstallationProgressTracker.tsx`
- Shows current phase, percent complete, upcoming/blocked milestones, inspection status, crew info
- Uses live subscription to updates and milestones

2) `InstallationUpdateForm.tsx` (contractor-facing)
- Post updates with type: `status_change | milestone | issue | photo | note`
- Upload photos/videos to Storage, attach URLs, tag milestone, optional issue severity

3) `PhotoGallery.tsx`
- Filter by phase/type, lightbox view, download/share
- Groups media from `installation_updates.photo_urls` and `video_url`

4) `InstallationFeed.tsx` (could be merged into dashboard)
- Chronological feed of updates with avatars, timestamps, media chips, tags

5) `InspectionScheduler.tsx`
- Request/schedule inspections, record results
- Uses inspection endpoints (below); displays status + notes

## API Endpoints (Step 5 scope)
All routes under `/api/installations/[id]/...` unless noted. Responses include `error` on failure.

1) `GET /api/installations/[id]/updates`
```json
{
  "updates": [
    {
      "id": "uuid",
      "updateType": "status_change",
      "title": "Crew en route",
      "description": "ETA 30 minutes",
      "photoUrls": ["https://..."],
      "videoUrl": null,
      "milestoneName": "Arrival",
      "isMilestone": true,
      "createdAt": "ISO8601",
      "postedBy": {"id": "uuid", "role": "contractor|customer"}
    }
  ]
}
```

2) `POST /api/installations/[id]/update`
```json
{
  "updateType": "issue|note|status_change|milestone|photo",
  "title": "Materials delivered",
  "description": "All panels received",
  "photoUrls": ["https://storage..."],
  "videoUrl": null,
  "milestoneName": "Materials delivered",
  "isMilestone": true
}
```
Stores in `installation_updates`; returns created update.

3) `POST /api/installations/[id]/photos`
```json
{
  "files": ["<signed upload URL token or form-data>"],
  "phase": "pre-install|in-progress|post-install",
  "tags": ["roof", "panel"]
}
```
- Upload via Supabase Storage (bucket `installation-media`), returns public URLs for reuse in update creation.

4) `POST /api/installations/[id]/progress`
```json
{
  "progressPercentage": 65,
  "currentPhase": "Panels Installed",
  "status": "in-progress"
}
```
- Persists to `installations` (progress/current_phase fields exist in 001 schema). Emits update with `update_type = 'status_change'`.

5) `POST /api/installations/[id]/inspection`
```json
{
  "type": "pre|final",
  "scheduledDate": "2025-02-10",
  "notes": "Need utility access",
  "status": "scheduled|completed|failed"
}
```
- If reusing `project_milestones`, create or update a milestone row; also write an `installation_updates` entry for audit trail.

6) `GET /api/installations/[id]/milestones`
- Returns milestone timeline derived from `project_milestones` filtered by installation/project.

## Realtime & Notifications
- Supabase Realtime on `installation_updates` (filter by `installation_id`) to push feed and progress changes.
- Optional: web push/email when `update_type` is `issue` or `status_change` to keep customer informed.

## Permissions
- Contractors: create updates, photos, inspections, progress changes.
- Customers: read-only feed/gallery; can acknowledge milestones/issues, optionally add customer notes.
- AuthZ: verify request user matches `installation.customer_id` or `contractor_id` for write paths where appropriate.

## Task Breakdown
- Create Step 5 API routes (6 listed above) with Supabase access and validation.
- Wire Storage upload helper for installation media (signed URLs + public URL return).
- Build UI components: ProgressTracker, UpdateForm, PhotoGallery, Feed, InspectionScheduler; integrate into dashboard view.
- Add realtime subscriptions in dashboard to `installation_updates`.
- Add notification hooks for status/issue updates.
- QA: end-to-end flow from scheduled installation → progress updates → inspection → completion.
