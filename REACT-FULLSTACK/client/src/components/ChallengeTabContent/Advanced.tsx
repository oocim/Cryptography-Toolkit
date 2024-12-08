import { useEffect, useState } from 'react';
import { Challenge, ChallengeCard } from '../Challenges';

export const fetchAdvancedChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await fetch("http://localhost:3000/challenges?category=Advanced");
    if (!response.ok) {
      throw new Error('Failed to fetch challenges');
    }
    const data: Challenge[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching advanced challenges:', error);
    return [];
  }
};

export const fetchUserProgress = async (): Promise<UserChallengeProgress[]> => {
  try {
    const response = await fetch("http://localhost:3000/challenges/advanced/progress");
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    const data: UserChallengeProgress[] = await response.json()
    const username = localStorage.getItem('username') || '';
    const filteredData = data.filter(entry => entry.username === username)
    console.log("Filtered Data:", filteredData)
    return filteredData;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
};

export interface UserChallengeProgress {
  progressId: number
  username: string
  challengeId: string
  solved: boolean
}

interface AdvancedChallengesProps {
  activeChallengeId: string | null;
  setActiveChallengeId: (id: string | null) => void;
  onSubmit: (answer: string, challengeId: string) => void;
  updateUserProgress: (username: string, challengeId: string, solved: boolean) => void;
  username: string;
}

export default function AdvancedChallenges({
  activeChallengeId,
  setActiveChallengeId,
  onSubmit,
  updateUserProgress,
  username,
}: AdvancedChallengesProps) {
  const [advancedChallenges, setAdvancedChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserChallengeProgress[]>([]);

  useEffect(() => {
    const loadChallengesAndProgress = async () => {
      const [challenges, progress] = await Promise.all([
        fetchAdvancedChallenges(),
        fetchUserProgress(),
      ]);
      setAdvancedChallenges(challenges);
      setUserProgress(progress);
    };
    loadChallengesAndProgress();
  }, [username]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {advancedChallenges.map((challenge) => {
        const progress =
          userProgress.find((p) => p.challengeId === challenge._id) || {
            progressId: 0,
            username: username,
            challengeId: challenge._id,
            solved: false,
          };
        return (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            userChallengeProgress={progress}
            isActive={activeChallengeId === challenge._id}
            onActivate={() => setActiveChallengeId(challenge._id)}
            onSubmit={(answer: string) => onSubmit(answer, challenge._id)}
            updateUserProgress={updateUserProgress}
          />
        );
      })}
    </div>
  );
}