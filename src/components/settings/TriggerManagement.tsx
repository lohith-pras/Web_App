import { useState } from 'react';
import type { Trigger } from '../../types';

interface TriggerManagementProps {
    customTriggers: Trigger[];
    onAddTrigger: (name: string, icon: string) => void;
    onDeleteTrigger: (id: string) => void;
}

export function TriggerManagement({ customTriggers, onAddTrigger, onDeleteTrigger }: TriggerManagementProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTriggerName, setNewTriggerName] = useState('');
    const [newTriggerIcon, setNewTriggerIcon] = useState('🚬');

    const handleAdd = () => {
        if (newTriggerName.trim()) {
            onAddTrigger(newTriggerName.trim(), newTriggerIcon);
            setNewTriggerName('');
            setNewTriggerIcon('🚬');
            setIsAdding(false);
        }
    };

    const commonEmojis = ['🚬', '☕', '🍺', '🎮', '📱', '💼', '🏠', '🚗', '😰', '😊'];

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500">My Triggers</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                >
                    {isAdding ? 'Cancel' : 'Edit'}
                </button>
            </div>

            {/* Custom triggers list */}
            <div className="space-y-2 mb-4">
                {customTriggers.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4 text-center">No custom triggers yet</p>
                ) : (
                    customTriggers.map((trigger) => (
                        <div
                            key={trigger.id}
                            className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{trigger.icon}</span>
                                <span className="text-white">{trigger.name}</span>
                            </div>
                            {isAdding && (
                                <button
                                    onClick={() => onDeleteTrigger(trigger.id)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add new trigger form */}
            {isAdding && (
                <div className="border-t border-gray-800 pt-4">
                    <p className="text-white font-medium mb-3">Add New Trigger</p>

                    {/* Icon selector */}
                    <div className="mb-3">
                        <p className="text-gray-400 text-sm mb-2">Select Icon</p>
                        <div className="grid grid-cols-5 gap-2">
                            {commonEmojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setNewTriggerIcon(emoji)}
                                    className={`text-2xl p-2 rounded-lg transition-colors ${newTriggerIcon === emoji ? 'bg-green-500/20' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name input */}
                    <input
                        type="text"
                        value={newTriggerName}
                        onChange={(e) => setNewTriggerName(e.target.value)}
                        placeholder="Trigger name"
                        className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        maxLength={20}
                    />

                    <button
                        onClick={handleAdd}
                        disabled={!newTriggerName.trim()}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        Add Trigger
                    </button>
                </div>
            )}
        </div>
    );
}
