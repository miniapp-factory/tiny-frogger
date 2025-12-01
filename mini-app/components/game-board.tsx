"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GameBoard() {
  const lanes = 8;
  const cols = 8;
  const [frog, setFrog] = useState({ row: 7, col: 3 });
  const [cars, setCars] = useState<Array<Array<boolean>>>(Array.from({ length: lanes }, (_, i) => {
    if (i === 0) return Array(cols).fill(false);
    const lane = Array(cols).fill(false);
    const carCount = Math.floor(Math.random() * 3) + 1;
    for (let c = 0; c < carCount; c++) {
      lane[Math.floor(Math.random() * cols)] = true;
    }
    return lane;
  }));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (gameOver || won) return;
    const interval = setInterval(() => {
      setCars(prev => prev.map((lane, idx) => {
        if (idx === 0) return lane;
        const newLane = [...lane];
        const last = newLane.pop();
        newLane.unshift(last ?? false);
        return newLane;
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [gameOver, won]);

  useEffect(() => {
    if (cars[frog.row][frog.col]) {
      setGameOver(true);
    }
    if (frog.row === 0) {
      setWon(true);
    }
  }, [frog, cars]);

  const move = (dr: number, dc: number) => {
    if (gameOver || won) return;
    const newRow = Math.min(lanes - 1, Math.max(0, frog.row + dr));
    const newCol = Math.min(cols - 1, Math.max(0, frog.col + dc));
    setFrog({ row: newRow, col: newCol });
  };

  const reset = () => {
    setFrog({ row: 7, col: 3 });
    setCars(Array.from({ length: lanes }, (_, i) => {
      if (i === 0) return Array(cols).fill(false);
      const lane = Array(cols).fill(false);
      const carCount = Math.floor(Math.random() * 3) + 1;
      for (let c = 0; c < carCount; c++) {
        lane[Math.floor(Math.random() * cols)] = true;
      }
      return lane;
    }));
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={reset}>Start Game</Button>
      <div className="grid grid-rows-8 grid-cols-8 gap-1 bg-yellow-200 p-2 rounded">
        {cars.flatMap((lane, r) =>
          lane.map((hasCar, c) => {
            const isFrog = frog.row === r && frog.col === c;
            const content = isFrog ? "🐸" : hasCar ? "🚗" : "";
            return (
              <div key={`${r}-${c}`} className="w-8 h-8 flex items-center justify-center border border-gray-400">
                {content}
              </div>
            );
          })
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => move(-1, 0)}>Up</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => move(0, -1)}>Left</Button>
          <Button variant="outline" onClick={() => move(0, 1)}>Right</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => move(1, 0)}>Down</Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>Play again</Button>
      </div>
      {gameOver && <span className="text-red-600">Game Over!</span>}
      {won && <span className="text-green-600">You Win!</span>}
    </div>
  );
}
