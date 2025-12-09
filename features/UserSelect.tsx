import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import { UserPlus, RefreshCcw } from '../components/Icons';
import { Player } from '../types';

interface UserSelectProps {
  players: Player[];
  avatars: string[];
  onSelect: (player: Player) => void;
  onCreate: (name: string, avatar: string) => void;
  onReset: () => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ players, onSelect, onCreate, avatars, onReset }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(avatars[0]);

  const handleCreate = () => {
      if (!newName.trim()) return;
      onCreate(newName, newAvatar);
  };

  return (
      <div className="h-[100dvh] bg-sky-200 p-4 flex flex-col items-center justify-center">
          <Card className="max-w-md w-full p-6 bg-white/90">
              <h2 className="text-2xl font-black text-center mb-6 uppercase text-gray-800 roblox-text-shadow text-white tracking-widest">
                  {isCreating ? "Cipta Pemain Baru" : "Pilih Pemain"}
              </h2>
              
              {!isCreating ? (
                  <div className="space-y-4">
                      {players.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto p-2">
                              {players.map(p => (
                                  <button key={p.id} onClick={() => onSelect(p)} className="flex flex-col items-center p-3 bg-blue-50 rounded-sm border-2 border-black hover:bg-blue-100 transition-colors roblox-shadow active:translate-y-1 active:shadow-none">
                                      <PlayerAvatar avatar={p.avatar} size="md" />
                                      <span className="font-bold mt-2 truncate w-full text-center">{p.name}</span>
                                      <span className="text-xs text-gray-500 font-bold">LVL {p.maxUnlockedLevel}</span>
                                  </button>
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-8 text-gray-500 font-bold">
                              Tiada pemain. Sila cipta baru!
                          </div>
                      )}
                      
                      <Button onClick={() => setIsCreating(true)} variant="success" className="w-full">
                          <UserPlus size={20} /> Pemain Baru
                      </Button>

                      <div className="pt-4 border-t-2 border-gray-300">
                          {showResetConfirm ? (
                              <div className="bg-red-100 p-2 border-2 border-red-500 rounded-sm animate-fadeIn">
                                  <div className="text-red-600 font-bold text-center text-xs mb-2">
                                      PASTI PADAM SEMUA?
                                      <br/>(Delete All Data?)
                                  </div>
                                  <div className="flex gap-2">
                                      <button 
                                          onClick={() => setShowResetConfirm(false)} 
                                          className="flex-1 bg-gray-200 border-2 border-black rounded-sm font-bold text-xs py-2 hover:bg-gray-300 shadow-sm"
                                      >
                                          BATAL
                                      </button>
                                      <button 
                                          onClick={() => { onReset(); setShowResetConfirm(false); }} 
                                          className="flex-1 bg-red-600 text-white border-2 border-black rounded-sm font-bold text-xs py-2 hover:bg-red-500 shadow-sm"
                                      >
                                          PADAM
                                      </button>
                                  </div>
                              </div>
                          ) : (
                              <button 
                                  onClick={() => setShowResetConfirm(true)}
                                  className="w-full text-red-500 font-bold text-xs uppercase tracking-widest hover:text-red-700 flex items-center justify-center gap-2"
                              >
                                  <RefreshCcw size={14}/> Reset Semua Data
                              </button>
                          )}
                      </div>
                  </div>
              ) : (
                  <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                          <PlayerAvatar avatar={newAvatar} size="lg" />
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                          {avatars.map(a => (
                              <button key={a} onClick={() => setNewAvatar(a)} className={`shrink-0 p-1 rounded-sm border-2 ${newAvatar === a ? 'bg-yellow-200 border-black' : 'bg-gray-100 border-transparent'}`}>
                                  <PlayerAvatar avatar={a} size="sm" className="w-12 h-12" />
                              </button>
                          ))}
                      </div>
                      <input 
                          type="text" 
                          placeholder="Masukkan Nama Anda" 
                          className="w-full p-3 border-4 border-black rounded-sm font-bold text-center text-xl uppercase placeholder:normal-case"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                      />
                      <div className="flex gap-2">
                          <Button onClick={() => setIsCreating(false)} variant="secondary" className="flex-1">Batal</Button>
                          <Button onClick={handleCreate} variant="success" className="flex-1" disabled={!newName.trim()}>Cipta</Button>
                      </div>
                  </div>
              )}
          </Card>
      </div>
  );
};

export default UserSelect;