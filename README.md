# গল্পের আসর — Golper Asor

A cinematic Bengali audio-story radio for exploring **Sunday Suspense** and
**Goppo Mir-er Thek** through characters, writers, genres, and original series.

![Golper Asor preview](public/og-image.png)

> **Unofficial fan project.** Golper Asor is not affiliated with Mirchi Bangla,
> Radio Mirchi, Goppo Mir-er Thek, RJ Mir, or the writers and publishers whose
> work appears in the linked broadcasts. Audio is streamed from the official
> YouTube channels and is never hosted by this repository.

## Experience

- Two radio-style stations with a silent tuning transition
- Bengali-first station identity with English callsigns
- Browse by character, writer, genre, or original series
- Curated playlists from the official Mirchi Bangla and Real Mir channels
- Character-specific cinematic backgrounds
- Interactive signal-waveform seeking and custom transport controls
- Anonymous per-channel **online now** visitor counts powered by realtime presence
- One-tap handoff from the player to the current story on YouTube
- Responsive programme archive for desktop and mobile
- Keyboard controls and reduced-motion support
- No autoplay: every broadcast waits for an explicit listener action

## Catalogue

The launch catalogue is defined in [`src/catalogue.ts`](src/catalogue.ts). It
currently includes 40 curated collections, including:

- **Characters:** Feluda, Byomkesh Bakshi, Professor Shonku, Taranath Tantrik,
  Kakababu, and Sherlock Holmes
- **Writers and works:** Rabindranath Tagore, Bankim Chandra Chattopadhyay,
  Tarapada Ray, Charles Dickens, Shirshendu Mukhopadhyay, Anish Deb, and more
- **Genres:** detective, horror, adventure, historical, comedy, and romance
- **Originals:** GMT Shorts, GMT Onstage, GMT Originals, Shorojontro,
  Mukhosher Arale, and Golpo Mancho

Unverified and non-story playlists are intentionally excluded.

## Tech stack

- React 19
- TypeScript
- Vite
- YouTube IFrame Player API
- Supabase Realtime Presence
- Lucide icons
- Google Fonts: Tiro Bangla, Bodoni Moda, and IBM Plex

Supabase is used only for anonymous realtime listener presence. No listener
profiles or personal details are stored by the application.

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/kaustavr19/Golper-Asor.git
cd Golper-Asor
npm install
copy .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
before starting the development server.

The development server will print the local URL, normally
`http://localhost:5173`.

## Commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create the production build
npm run lint     # Run oxlint
npm run preview  # Preview the production build locally
```

## Deploying to Vercel

The repository includes [`vercel.json`](vercel.json), although Vercel also
detects the Vite configuration automatically.

1. Import `kaustavr19/Golper-Asor` in Vercel.
2. Keep the detected framework as **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the Vercel
   project environment variables.
6. Deploy.

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/kaustavr19/Golper-Asor)

## Keyboard controls

| Key | Action |
| --- | --- |
| `Space` | Play or pause |
| `←` / `→` | Seek 5 seconds |
| `Shift` + `←` / `→` | Previous or next broadcast |
| `↑` / `↓` | Adjust volume |
| `M` | Mute |
| `S` | Surprise broadcast / shuffle |
| `?` | Open shortcut guide |

## Project structure

```text
src/
├── assets/              Character and atmospheric backgrounds
├── components/          Player, waveform, archive, and radio controls
├── hooks/               YouTube player and realtime presence integration
├── lib/                 Shared service clients
├── utils/               Title parsing and thumbnail helpers
├── catalogue.ts         Channel and playlist catalogue
├── App.tsx              Main experience and interaction state
└── App.css              Responsive visual system
```

## Content and artwork

Playlist IDs point to publicly available YouTube playlists. Titles and playlist
order are obtained at runtime through the YouTube player and noembed metadata.

The background illustrations are original, AI-assisted fan-art interpretations
created for this interface. They intentionally avoid actor likenesses, official
logos, and copied film or television designs.

## Notes

- A network connection is required for YouTube playback, thumbnails, metadata,
  and hosted fonts.
- Playlist contents and counts can change when the source channels update them.
- Browser media policies are respected; the site does not autoplay audio.
