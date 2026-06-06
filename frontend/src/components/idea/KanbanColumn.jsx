import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ListFilter, MoreHorizontal, Plus, Search, ThumbsUp, Lightbulb, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useIdeas from '../../hooks/idea/useIdeas';
import IdeaCard from './IdeaCard';
import AddIdeaModal from './AddIdeaModal.jsx';
import { IDEA_STATUS } from '../../constants/ideaConstants.js';


const COLUMN_CONFIGS = {
    draft: {
        id: 'ideas',
        title: 'Ideas to try',
        theme: {
            bg: 'bg-amber-50/40',
            border: 'border-amber-100/60',
            countBg: 'bg-gray-200/70',
            countText: 'text-gray-600'
        },
        showAddIdea: true,
    },
    in_progress: {
        id: 'progress',
        title: 'In Progress',
        theme: {
            bg: 'bg-[#378ADD]/5',
            border: 'border-[#378ADD]/10',
            countBg: 'bg-[#378ADD]/10',
            countText: 'text-[#378ADD]',
            cardBorder: 'border-[#378ADD]/30'
        },
    },
    done: {
        id: 'done',
        title: 'Done',
        theme: {
            bg: 'bg-green-50/50',
            border: 'border-green-100/50',
            countBg: 'bg-green-100/80',
            countText: 'text-green-700'
        },
    },
}

const EMPTY_STATES = {
    [IDEA_STATUS.DRAFT]: {
        icon: <Lightbulb className="w-5 h-5 text-gray-400" />,
        title: 'No ideas yet',
        description: 'Add an idea to get started',
    },
    [IDEA_STATUS.IN_PROGRESS]: {
        icon: <Clock className="w-5 h-5 text-gray-400" />,
        title: 'Nothing in progress',
        description: 'Move an idea here to start working on it',
    },
    [IDEA_STATUS.DONE]: {
        icon: <CheckCircle2 className="w-5 h-5 text-gray-400" />,
        title: 'Nothing completed yet',
        description: 'Finished ideas will appear here',
    },
}

export default function KanbanColumn({ state, onCardClick }) {

    const { data: ideas = [], isSuccess } = useIdeas()
    console.log(ideas)
    const currentIdeas = ideas.filter(c => c.status === state)

    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false)

    const { id, title, theme, showAddIdea } = COLUMN_CONFIGS[state]
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem(`kanban-col-collapsed-${state}`) === 'true';
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const searchInputRef = useRef(null);
    const sortRef = useRef(null);
    const searchContainerRef = useRef(null);

    const toggleCollapse = () => {
        const newVal = !isCollapsed;
        setIsCollapsed(newVal);
        localStorage.setItem(`kanban-col-collapsed-${state}`, newVal);
    };

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsSearchOpen(false);
    };


    if (isCollapsed) {
        return (
            <div
                className={`flex flex-col items-center py-4 px-2 w-[48px] shrink-0 rounded-2xl border cursor-pointer hover:opacity-80 transition-opacity ${theme.bg} ${theme.border} h-[calc(100vh-220px)] min-h-[400px] max-h-[700px]`}
                onClick={toggleCollapse}
                title={`Expand ${title}`}
            >
                <div className="flex flex-col items-center gap-4 h-full w-full">
                    <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${theme.countBg} ${theme.countText}`}>{currentIdeas.length}</span>
                    <div className="flex-1 flex justify-center items-start w-full mt-2 overflow-hidden">
                        <h3 className="text-[14px] font-semibold text-gray-700 tracking-wider [writing-mode:vertical-rl]">
                            {title}
                        </h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-auto shrink-0" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div key={state} className={`w-[85vw] md:w-auto md:flex-1 shrink-0 snap-start min-w-[216px] flex flex-col rounded-2xl border h-full md:max-h-[calc(100dvh-220px)] ${theme.bg} ${theme.border} overflow-hidden`}>
                {/* Header */}
                <div className="shrink-0 p-3 pb-2 border-b border-transparent" ref={searchContainerRef}>
                    <div className="flex items-center justify-between mb-1 px-1">
                        <div className="flex items-center gap-2 truncate pr-2">
                            <h3 className="text-[14px] font-semibold text-gray-900 truncate">{title}</h3>
                            <span className={`py-0.5 px-2 rounded-full text-xs font-semibold shrink-0 ${theme.countBg} ${theme.countText}`}>{currentIdeas.length}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                className={`transition-colors p-1 rounded-md ${isSearchOpen ? 'text-gray-900 bg-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <div className="relative" ref={sortRef}>
                                <button
                                    className={`transition-colors p-1 rounded-md ${isSortOpen ? 'text-gray-900 bg-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                >
                                    <ListFilter className="w-4 h-4" />
                                </button>
                                {isSortOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-20">

                                        <button key={opt} className={`w-full text-left px-3 py-1.5 text-[13px] ${sortBy === opt ? 'bg-gray-50 text-[#378ADD] font-medium' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => { setSortBy(opt); setIsSortOpen(false); }}>
                                        </button>

                                    </div>
                                )}
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200" onClick={toggleCollapse}>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {isSearchOpen && (
                        <div className="mt-2 px-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Filter cards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#378ADD]/20 focus:border-[#378ADD]"
                            />
                        </div>
                    )}
                </div>

                {/* Cards */}

                {currentIdeas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            {EMPTY_STATES[state].icon}
                        </div>
                        <p className="text-[13px] font-medium text-gray-500">No {COLUMN_CONFIGS[state].title}</p>
                        <p className="text-[12px] text-gray-400 mt-1">Ideas added here will show up</p>
                    </div>
                ) : (

                    <div className="flex-1 h-full overflow-y-auto scrollbar-hide px-3 pb-3">
                        <div className="flex flex-col gap-3">

                            {currentIdeas.map(idea => (
                                <IdeaCard key={idea.id} currentIdea={idea} state={state} theme={theme} />
                            ))}

                        </div>
                    </div>
                )}

                {showAddIdea && (
                    <div className="shrink-0 px-3 pb-3 pt-1 mt-auto">
                        <button onClick={() => setIsAddIdeaModalOpen(true)} className="flex items-center justify-center gap-1.5 w-full text-green-600 hover:text-green-700 hover:bg-amber-100/40 rounded-xl py-2 transition-colors text-[13px] font-medium">
                            <Plus className="w-4 h-4" /> Add idea
                        </button>
                    </div>
                )}

            </div>

            <AddIdeaModal isOpen={isAddIdeaModalOpen} onClose={() => setIsAddIdeaModalOpen(false)} />
        </>
    );
}