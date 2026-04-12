import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FiBookOpen,
  FiFolderPlus,
  FiLayers,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import CategoryFormModal from "../components/CategoryFormModal";
import CategorySection from "../components/CategorySection";
import EmptyState from "../components/EmptyState";
import ResourceFormModal from "../components/ResourceFormModal";
import Sidebar from "../components/Sidebar";
import SubjectFormModal from "../components/SubjectFormModal";
import ThemeToggle from "../components/ThemeToggle";
import VideoModal from "../components/VideoModal";
import { useTheme } from "../hooks/useTheme";
import { useDevVaultStore } from "../store/useDevVaultStore";
import type { Category, Resource } from "../types";

function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const {
    subjects,
    activeSubjectId,
    activeSubject,
    isLoading,
    isMutating,
    error,
    initialize,
    selectSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    createCategory,
    updateCategory,
    deleteCategory,
    createResource,
    updateResource,
    deleteResource,
    toggleBookmark,
    clearError,
    logout,
    currentUser,
  } = useDevVaultStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState<
    "create" | "edit" | null
  >(null);
  const [categoryEditor, setCategoryEditor] = useState<Category | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [resourceEditor, setResourceEditor] = useState<Resource | null>(null);
  const [resourceCategoryId, setResourceCategoryId] = useState<string | null>(
    null,
  );
  const [videoPreview, setVideoPreview] = useState<{
    title: string;
    embedUrl: string;
  } | null>(null);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const filteredCategories = useMemo(() => {
    if (!activeSubject) return [];

    return activeSubject.categories
      .map((category) => ({
        ...category,
        resources: category.resources.filter((resource) => {
          const query = searchTerm.toLowerCase();
          const matchesSearch =
            resource.title.toLowerCase().includes(query) ||
            resource.url.toLowerCase().includes(query);
          const matchesBookmark = bookmarksOnly ? resource.isBookmarked : true;
          return matchesSearch && matchesBookmark;
        }),
      }))
      .filter(
        (category) =>
          category.resources.length > 0 || (!searchTerm && !bookmarksOnly),
      );
  }, [activeSubject, bookmarksOnly, searchTerm]);

  const totalVisibleResources = filteredCategories.reduce(
    (count, category) => count + category.resources.length,
    0,
  );

  const handleDeleteSubject = async () => {
    if (
      !activeSubject ||
      !window.confirm(`Delete ${activeSubject.name} and all nested data?`)
    ) {
      return;
    }

    await deleteSubject(activeSubject._id);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (
      !window.confirm(`Delete ${category.title} and all resources inside it?`)
    )
      return;
    await deleteCategory(category._id);
  };

  const handleDeleteResource = async (resource: Resource) => {
    if (!window.confirm(`Delete ${resource.title}?`)) return;
    await deleteResource(resource._id);
  };

  return (
    <div className="min-h-screen px-4 py-4 text-slate-900 transition-colors duration-200 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar
          subjects={subjects}
          activeSubjectId={activeSubjectId}
          onSelect={(id) => void selectSubject(id)}
          onCreateSubject={() => setSubjectModalMode("create")}
        />

        <main className="space-y-4">
          <section className="glass-panel rounded-[32px] p-6 lg:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                  <FiLayers size={14} />
                  Knowledge dashboard
                </div>
                {currentUser ? (
                  <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                    Hello, {currentUser.name}! Your private subjects are listed
                    below.
                  </p>
                ) : null}
                <h2 className="mt-4 font-display text-4xl font-bold text-slate-900 dark:text-white">
                  {activeSubject?.name ?? "Build your first subject"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Organize official docs, development notes, quick reviews, and
                  interview prep in a single clean workflow. Search across
                  resources, star important links, and open videos directly
                  inside the app.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateCategory(true)}
                  disabled={!activeSubject}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
                >
                  <FiPlus size={16} />
                  Add category
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectModalMode("edit")}
                  disabled={!activeSubject}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
                >
                  Edit subject
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteSubject()}
                  disabled={!activeSubject}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/25 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <FiTrash2 size={16} />
                  Delete subject
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                  label="Categories"
                  value={activeSubject?.stats.categoryCount ?? 0}
                  icon={<FiLayers className="text-emerald-500" size={22} />}
                />
                <StatCard
                  label="Resources"
                  value={activeSubject?.stats.resourceCount ?? 0}
                  icon={<FiBookOpen className="text-sky-500" size={22} />}
                />
                <StatCard
                  label="Starred"
                  value={activeSubject?.stats.bookmarkCount ?? 0}
                  icon={<FiStar className="text-amber-500" size={22} />}
                />
              </div>

              <div className="flex flex-col gap-3 lg:w-[380px]">
                <label className="relative block">
                  <FiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search titles or URLs"
                    className="w-full rounded-2xl border border-slate-200 bg-white/85 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-950/55 dark:text-white dark:focus:border-emerald-400"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setBookmarksOnly((current) => !current)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    bookmarksOnly
                      ? "bg-amber-400/20 text-amber-700 ring-1 ring-inset ring-amber-400/30 dark:text-amber-300"
                      : "border border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
                  }`}
                >
                  <FiStar size={16} />
                  {bookmarksOnly
                    ? "Showing starred only"
                    : "Filter starred resources"}
                </button>
              </div>
            </div>
          </section>

          {error ? (
            <div className="glass-panel rounded-3xl border-red-200/60 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={clearError}
                  className="font-semibold underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}

          {isLoading ? (
            <div className="glass-panel rounded-[32px] p-8 text-center text-slate-600 dark:text-slate-300">
              Loading DevVault data...
            </div>
          ) : !activeSubject ? (
            <EmptyState
              title="No subjects yet"
              description="Create your first subject to start organizing docs, articles, videos, and revision links."
              actionLabel="Create subject"
              onAction={() => setSubjectModalMode("create")}
            />
          ) : filteredCategories.length ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    Focus board
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {totalVisibleResources} resources visible across{" "}
                    {filteredCategories.length} categories.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setResourceCategoryId(
                      activeSubject.categories[0]?._id ?? null,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  <FiFolderPlus size={16} />
                  Add resource
                </button>
              </div>

              {filteredCategories.map((category, index) => (
                <div
                  key={category._id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <CategorySection
                    category={category}
                    resources={category.resources}
                    onCreateResource={setResourceCategoryId}
                    onEditCategory={setCategoryEditor}
                    onDeleteCategory={(item) => void handleDeleteCategory(item)}
                    onEditResource={setResourceEditor}
                    onDeleteResource={(item) => void handleDeleteResource(item)}
                    onToggleBookmark={(item) => void toggleBookmark(item)}
                    onPreviewVideo={(resource, embedUrl) =>
                      setVideoPreview({ title: resource.title, embedUrl })
                    }
                  />
                </div>
              ))}
            </section>
          ) : (
            <EmptyState
              title="No resources match these filters"
              description="Try a different search query, turn off the bookmark filter, or add new resources."
              actionLabel="Add resource"
              onAction={() =>
                setResourceCategoryId(activeSubject.categories[0]?._id ?? null)
              }
            />
          )}

          {isMutating ? (
            <div className="fixed bottom-6 right-6 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg dark:bg-emerald-400 dark:text-slate-950">
              Saving changes...
            </div>
          ) : null}
        </main>
      </div>

      {subjectModalMode === "create" ? (
        <SubjectFormModal
          title="Create subject"
          description="Add a learning track such as HTML, JavaScript, React, or MongoDB."
          submitLabel="Create subject"
          onClose={() => setSubjectModalMode(null)}
          onSubmit={(name) => createSubject({ name })}
        />
      ) : null}

      {subjectModalMode === "edit" && activeSubject ? (
        <SubjectFormModal
          title="Edit subject"
          description="Rename this subject without affecting its categories or resources."
          submitLabel="Save changes"
          initialName={activeSubject.name}
          onClose={() => setSubjectModalMode(null)}
          onSubmit={(name) => updateSubject(activeSubject._id, { name })}
        />
      ) : null}

      {showCreateCategory && activeSubject ? (
        <CategoryFormModal
          title="Create category"
          description="Group related resources under official docs, quick review, development, or interview prep."
          submitLabel="Create category"
          onClose={() => setShowCreateCategory(false)}
          onSubmit={(title) =>
            createCategory({ title, subjectId: activeSubject._id })
          }
        />
      ) : null}

      {categoryEditor ? (
        <CategoryFormModal
          title="Edit category"
          description="Update the category title for this group of resources."
          submitLabel="Save changes"
          initialTitle={categoryEditor.title}
          onClose={() => setCategoryEditor(null)}
          onSubmit={(title) => updateCategory(categoryEditor._id, title)}
        />
      ) : null}

      {(resourceEditor || resourceCategoryId) && activeSubject ? (
        <ResourceFormModal
          resource={resourceEditor ?? undefined}
          defaultCategoryId={resourceCategoryId ?? undefined}
          categories={activeSubject.categories.map((category) => ({
            _id: category._id,
            title: category.title,
          }))}
          onClose={() => {
            setResourceEditor(null);
            setResourceCategoryId(null);
          }}
          onSubmit={(payload) =>
            resourceEditor
              ? updateResource(resourceEditor._id, payload)
              : createResource(payload)
          }
        />
      ) : null}

      {videoPreview ? (
        <VideoModal
          title={videoPreview.title}
          embedUrl={videoPreview.embedUrl}
          onClose={() => setVideoPreview(null)}
        />
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="font-display text-4xl font-bold">{value}</span>
        {icon}
      </div>
    </div>
  );
}

export default DashboardPage;
