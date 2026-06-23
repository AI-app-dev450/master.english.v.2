import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Import,
} from 'lucide-react';
import { useApp } from '@/App';
import { WordCard } from '@/components/WordCard';
import { AddWordModal } from '@/components/AddWordModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { ImportExportModal } from '@/components/ImportExportModal';
import type { VocabularyWord, FilterLevel, SortOption } from '@/types/vocabulary';

const FILTER_OPTIONS: { value: FilterLevel; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'level', label: 'By Level' },
  { value: 'studied', label: 'Most Studied' },
];

export function WordList() {
  const { vocabulary } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterLevel>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [editWord, setEditWord] = useState<VocabularyWord | null>(null);
  const [deleteWordId, setDeleteWordId] = useState<string | null>(null);
  const [deleteWordName, setDeleteWordName] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredWords = useMemo(() => {
    return vocabulary.getFilteredWords(activeFilter, sortOption, searchQuery);
  }, [vocabulary, activeFilter, sortOption, searchQuery]);

  const handleEdit = (word: VocabularyWord) => {
    setEditWord(word);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const word = vocabulary.words.find(w => w.id === id);
    if (word) {
      setDeleteWordId(id);
      setDeleteWordName(word.word);
    }
  };

  const confirmDelete = () => {
    if (deleteWordId) {
      vocabulary.deleteWord(deleteWordId);
      setDeleteWordId(null);
      setDeleteWordName('');
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditWord(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A2E]">My Words</h1>
          <p className="mt-1 text-sm text-[#6B6B80]">
            {vocabulary.words.length} words in your vocabulary
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportExportOpen(true)}
            className="flex items-center gap-2 rounded-[10px] border border-[#E5E5DD] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-[#F5F5F0]"
          >
            <Import className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Import / Export</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-[10px] bg-[#F5A623] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E09400]"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Word
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9B9BAE]" strokeWidth={1.5} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search words, definitions, translations..."
          className="w-full rounded-[10px] border border-[#E5E5DD] bg-white py-3 pl-12 pr-4 text-sm text-[#1A1A2E] placeholder:text-[#9B9BAE]"
        />
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? 'border border-[#F5A623] bg-[#FFF3DD] text-[#B37600]'
                  : 'border border-[#E5E5DD] bg-white text-[#6B6B80] hover:bg-[#F5F5F0]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="ml-auto relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 rounded-lg border border-[#E5E5DD] bg-white px-3 py-1.5 text-sm font-medium text-[#6B6B80] hover:bg-[#F5F5F0]"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            {SORT_OPTIONS.find(s => s.value === sortOption)?.label}
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 z-10 w-48 rounded-xl border border-[#E5E5DD] bg-white py-1 shadow-lg">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSortOption(option.value); setShowSortDropdown(false); }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${
                    sortOption === option.value
                      ? 'bg-[#FFF3DD] text-[#B37600] font-medium'
                      : 'text-[#1A1A2E] hover:bg-[#F5F5F0]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Word Grid */}
      {filteredWords.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredWords.map((word, i) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.5) }}
            >
              <WordCard
                word={word}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showTranslations={vocabulary.settings.showTranslations}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E5DD] bg-white py-16">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F0]">
            <Search className="h-8 w-8 text-[#9B9BAE]" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A2E]">No words found</h3>
          <p className="mt-1 text-sm text-[#6B6B80]">
            {searchQuery ? 'Try a different search term' : 'Start by adding your first word'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 rounded-[10px] bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E09400]"
          >
            Add Word
          </button>
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623] text-white shadow-lg shadow-[#F5A623]/40 transition-transform hover:scale-105 active:scale-95 md:hidden"
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Modals */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        editWord={editWord}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteWordId}
        onClose={() => setDeleteWordId(null)}
        onConfirm={confirmDelete}
        wordName={deleteWordName}
      />
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </motion.div>
  );
}
