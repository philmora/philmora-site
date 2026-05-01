// @ts-ignore
import { useEffect, useState, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"

const MIRROR_REPO_BASE = "https://github.com/philmora/product-factory-mirror/blob/main"
const MIRROR_RAW_BASE =
    "https://raw.githubusercontent.com/philmora/product-factory-mirror/main"
const RECIPES_INDEX_URL = `${MIRROR_RAW_BASE}/recipes.json`

interface RecipeItem {
    slug: string
    title: string
    dek: string
    date: string
    updated: string
    category: string
    order: number
    tags?: string[]
    "applies-to"?: string[]
}

interface CategoryMeta {
    display: string
    order: number
}

interface RecipesIndex {
    _categories: Record<string, CategoryMeta>
    [key: string]: any
}

function formatDate(iso: string | undefined): string {
    if (!iso) return ""
    try {
        const d = new Date(iso + "T12:00:00Z")
        if (isNaN(d.getTime())) return iso
        return d
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: "UTC",
            })
            .replace(/\//g, "-")
    } catch {
        return iso
    }
}

interface SortedCategory {
    slug: string
    display: string
    order: number
    items: RecipeItem[]
}

function sortCategories(idx: RecipesIndex | null): SortedCategory[] {
    if (!idx || !idx._categories) return []
    const cats = Object.entries(idx._categories).map(([slug, meta]) => {
        const raw = idx[slug]
        const items = Array.isArray(raw) ? (raw as RecipeItem[]) : []
        const sorted = [...items].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )
        return {
            slug,
            display: meta.display ?? slug,
            order: meta.order ?? 0,
            items: sorted,
        }
    })
    cats.sort((a, b) => a.order - b.order)
    return cats
}

function emptyStateCopy(displayName: string): string {
    const lower = displayName.toLowerCase()
    return `No public ${lower} yet. Forthcoming.`
}

/**
 * FactoryIndex — Terminal Aurora Product Factory index/catalog page.
 * URL: /factory
 * Fetches recipes.json from philmora/product-factory-mirror, renders the
 * catalog grouped by category. Each recipe links OUT to its GitHub
 * markdown blob (rendered by GitHub). No /factory/:slug route — recipes
 * live as canonical markdown files in the public mirror repo.
 */
export default function FactoryIndex() {
    const [idx, setIdx] = useState<RecipesIndex | null>(null)
    const [fetchState, setFetchState] = useState<
        "loading" | "ready" | "error"
    >("loading")

    useEffect(() => {
        if (typeof window === "undefined") return
        let cancelled = false
        ;(async () => {
            try {
                const r = await fetch(RECIPES_INDEX_URL, { cache: "no-store" })
                if (!r.ok) throw new Error(`recipes ${r.status}`)
                const w: RecipesIndex = await r.json()
                if (cancelled) return
                setIdx(w)
                setFetchState("ready")
            } catch (e) {
                if (!cancelled) {
                    console.warn("product-factory index fetch failed", e)
                    setFetchState("error")
                }
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const categories = useMemo(() => sortCategories(idx), [idx])

    return (
        <>
            <style>{CSS}</style>
            <main className="fac-detail">
                <div className="fac-page">
                    <div className="fac-eyebrow">
                        <span className="dot" />
                        § PRODUCT FACTORY / PORTABLE CRAFT
                    </div>

                    <h1 className="fac-page-title">
                        Product <em>Factory.</em>
                    </h1>

                    <p className="fac-dek">
                        Cross-project recipes, patterns, and decisions for the
                        practice of <em>shipping</em> software products. A
                        Karpathy-style craft wiki — public companion of a
                        private one, kept honest by an airlock.
                    </p>

                    <div className="fac-intro">
                        <p>
                            Each entry here is a portable tool — something I'd
                            apply to a brand-new product I started tomorrow.
                            Project-specific knowledge lives elsewhere; this
                            page is the part of my practice that travels.
                        </p>
                        <p>
                            Recipes live as markdown in{" "}
                            <a
                                href="https://github.com/philmora/product-factory-mirror"
                                target="_blank"
                                rel="noopener"
                            >
                                philmora/product-factory-mirror
                            </a>
                            . Click any recipe below to read it on GitHub
                            (rendered cleanly with diff history and
                            cross-links). Fork freely.
                        </p>
                    </div>

                    {fetchState === "loading" && (
                        <p className="fac-status">Loading recipes…</p>
                    )}
                    {fetchState === "error" && (
                        <p className="fac-status">
                            Recipe index unreachable. Check{" "}
                            <a
                                href="https://github.com/philmora/product-factory-mirror"
                                target="_blank"
                                rel="noopener"
                            >
                                philmora/product-factory-mirror
                            </a>
                            .
                        </p>
                    )}
                    {fetchState === "ready" &&
                        categories.map((cat) => (
                            <section key={cat.slug} className="fac-category">
                                <h2>// {cat.display}</h2>
                                {cat.items.length === 0 ? (
                                    <p className="fac-empty-state">
                                        {emptyStateCopy(cat.display)}
                                    </p>
                                ) : (
                                    <ul className="fac-recipe-list">
                                        {cat.items.map((item, idx2) => {
                                            const numStr = String(
                                                item.order ?? idx2 + 1
                                            ).padStart(2, "0")
                                            const href = `${MIRROR_REPO_BASE}/${item.category}/${item.slug}.md`
                                            return (
                                                <li key={item.slug}>
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener"
                                                        data-cursor="link"
                                                    >
                                                        <div className="num">
                                                            § {numStr}
                                                        </div>
                                                        <div className="body">
                                                            <h3
                                                                className="title"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        item.title,
                                                                }}
                                                            />
                                                            <p
                                                                className="item-dek"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        item.dek,
                                                                }}
                                                            />
                                                            <span className="ext">
                                                                READ ON GITHUB ↗
                                                            </span>
                                                        </div>
                                                        <div className="meta">
                                                            {formatDate(
                                                                item.date
                                                            )}
                                                        </div>
                                                    </a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </section>
                        ))}
                </div>
            </main>
        </>
    )
}

addPropertyControls(FactoryIndex, {})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);

.fac-detail { color: #EDE6D7; font-family: 'JetBrains Mono', ui-monospace, monospace; position: relative; z-index: 3; }
.fac-detail * { box-sizing: border-box; }
.fac-detail h1, .fac-detail h2, .fac-detail h3, .fac-detail p, .fac-detail ol, .fac-detail ul, .fac-detail li { margin: 0; padding: 0; }
.fac-detail ol, .fac-detail ul { list-style: none; }
.fac-detail a { color: inherit; text-decoration: none; }

.fac-page { max-width: 1100px; margin: 0 auto; padding: 160px clamp(24px, 4vw, 72px) 80px; }

@keyframes fac_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }

.fac-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; font-weight: 500; display: inline-flex; align-items: center; margin-bottom: 28px; }
.fac-eyebrow .dot { display: inline-block; width: 6px; height: 6px; background: #E26B38; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 12px rgba(226,107,56,0.25); animation: fac_pulse 1.8s ease-in-out infinite; }

.fac-page-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(56px, 10vw, 144px); letter-spacing: -0.03em; line-height: 0.92; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 0 0 32px; text-wrap: balance; }
.fac-page-title em { font-style: italic; font-weight: 900; color: #E26B38; }

.fac-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.4vw, 32px); line-height: 1.35; letter-spacing: -0.01em; color: #BDB6A8; max-width: 780px; margin: 0 0 64px; text-wrap: pretty; }
.fac-dek em { color: #E26B38; font-style: italic; font-weight: 400; }

.fac-intro { margin-bottom: 96px; padding-bottom: 48px; border-bottom: 1px solid rgba(237,230,215,0.08); max-width: 720px; }
.fac-intro p { font-family: 'Fraunces', serif; font-weight: 300; font-size: 19px; line-height: 1.6; color: #BDB6A8; margin: 0 0 16px; }
.fac-intro p:last-child { margin-bottom: 0; }
.fac-intro p em { color: #E26B38; font-style: italic; font-weight: 400; }
.fac-intro a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: border-color 200ms; }
.fac-intro a:hover { border-bottom-color: #E26B38; }

.fac-status { font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; font-size: 19px; color: #7A7568; margin: 32px 0; }
.fac-status a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); }

.fac-category { margin-bottom: 80px; }
.fac-category h2 { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #E26B38; margin: 0 0 32px; padding-bottom: 12px; border-bottom: 1px solid rgba(237,230,215,0.08); font-weight: 500; }

.fac-recipe-list { list-style: none; padding: 0; margin: 0; }
.fac-recipe-list li { border-top: 1px solid rgba(237,230,215,0.08); }
.fac-recipe-list li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }

.fac-recipe-list a { display: grid; grid-template-columns: 88px 1fr auto; gap: 32px; align-items: baseline; padding: 32px 0; text-decoration: none; color: inherit; transition: padding 300ms; position: relative; }
.fac-recipe-list a::before { content: ""; position: absolute; left: 0; top: 50%; height: 1px; width: 0; background: #E26B38; transition: width 300ms; transform: translateY(-50%); }
.fac-recipe-list a:hover { padding-left: 28px; }
.fac-recipe-list a:hover::before { width: 20px; }

.fac-recipe-list .num { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #E26B38; text-transform: uppercase; padding-top: 10px; }

.fac-recipe-list .body { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.fac-recipe-list .title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(28px, 3.4vw, 42px); line-height: 1.05; letter-spacing: -0.025em; color: #EDE6D7; margin: 0; font-variation-settings: "opsz" 144, "SOFT" 50; transition: color 200ms; text-wrap: balance; }
.fac-recipe-list a:hover .title { color: #E26B38; }
.fac-recipe-list .title em { font-style: italic; font-weight: 900; color: #E26B38; }

.fac-recipe-list .item-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: 18px; line-height: 1.4; color: #BDB6A8; margin: 0; max-width: 580px; text-wrap: pretty; }

.fac-recipe-list .ext { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; color: #7A7568; text-transform: uppercase; margin-top: 4px; transition: color 200ms; }
.fac-recipe-list a:hover .ext { color: #E26B38; }

.fac-recipe-list .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A7568; white-space: nowrap; padding-top: 14px; }

.fac-empty-state { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 18px; color: #7A7568; margin: 0; padding: 8px 0 16px; }

@media (max-width: 800px) {
    .fac-page { padding: 120px 20px 60px; }
    .fac-recipe-list a { grid-template-columns: 1fr; gap: 8px; padding: 24px 0; }
    .fac-recipe-list .meta { padding-top: 0; order: 3; }
}
`
