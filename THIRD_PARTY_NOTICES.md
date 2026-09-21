# Third-party source notices

PIck reuses source files from the official Next.js `examples/with-supabase`
starter at commit `fc4f062ba96f37f971bcbab8858d96e413d86bf9`:

https://github.com/vercel/next.js/tree/fc4f062ba96f37f971bcbab8858d96e413d86bf9/examples/with-supabase

- `components/ui/{button,input,label,card}.tsx`: reused UI components.
- `lib/utils.ts`, `lib/supabase/{client,server}.ts`: reused with local adaptations.
- `components/auth-form.tsx`, `proxy.ts`: adapted from starter authentication and session-refresh patterns.

The upstream license is reproduced below. This notice does not assign an
open-source license to PIck's original code. Package dependencies retain their
own licenses in the installed packages.

## MkDocs and Material for MkDocs

The Wiki uses the pinned packages in `wiki/requirements.txt`. MkDocs is
distributed under the BSD 2-Clause license. Material for MkDocs is distributed
under the MIT license. The project does not copy their source code; the
packages are installed as build dependencies for the Markdown Wiki.

## Next.js starter and shadcn/ui — MIT

The MIT License (MIT)

Copyright (c) 2025 Vercel, Inc.

Copyright (c) 2023 shadcn

The same MIT terms below apply to both sources. shadcn/ui upstream license:
https://github.com/shadcn-ui/ui/blob/main/LICENSE.md

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
