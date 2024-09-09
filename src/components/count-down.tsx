"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStartResume = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number"? duration : 0); 
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-700">
      <h1 className="text-3xl font-bold mb-6 text-white shadow-lg">Countdown Timer</h1>
      <div className="flex flex-col space-y-4 w-full max-w-sm p-6 bg-white rounded-lg shadow-md border border-green-800">
        <Input
          type="number"
          placeholder="Enter duration (seconds)"
          value={duration}
          onChange={handleDurationChange}
          className="p-3 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <Button
          onClick={handleSetDuration}
          className="bg-green-600 text-white p-3 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Set Duration
        </Button>
        <div className="text-4xl font-mono text-center text-green-800 bg-green-100 p-4 rounded-lg shadow-inner">
          {formatTime(timeLeft)}
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleStartResume}
            className="p-3 rounded-lg text-white bg-green-500 shadow-md hover:bg-green-600 transition"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            className="p-3 rounded-lg text-white bg-green-400 shadow-md hover:bg-green-500 transition"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="p-3 rounded-lg text-white bg-red-600 shadow-md hover:bg-red-700 transition"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
