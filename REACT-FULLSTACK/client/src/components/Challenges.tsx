import React, { useState, useEffect, useCallback } from 'react'
import { Trophy, Star, Lock, Timer, Lightbulb, CheckCircle, HelpCircle, Award } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import BeginnerChallenges from './ChallengeTabContent/Beginner'
import IntermediateChallenges from './ChallengeTabContent/Intermediate'
import AdvancedChallenges from './ChallengeTabContent/Advanced'
import SignUp from './Auth/SignUp'
import Login from './Auth/Login'
import Leaderboard from './ChallengeTabContent/Leaderboard'

export interface Challenge {
  challengeId: number
  title: string
  description: string
  ciphertext: string
  plaintext: string
  points: number
  timeLimit: string
  hint: string
  cipherType: string
  cipherMode: string
  completed: boolean
}

export interface UserChallengeProgress {
  progressId: number
  userId: number
  challengeId: number
  solved: boolean
}

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
}

interface ChallengeCardProps {
  challenge: Challenge
  userChallengeProgress: UserChallengeProgress
  isActive: boolean
  onActivate: () => void
  onSubmit: (answer: string, challengeId: number) => void
  updateUserProgress: (progressId: number, challengeId: number, solved: boolean) => void
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  userChallengeProgress, 
  isActive, 
  onActivate, 
  onSubmit,
  updateUserProgress 
}) => {
  const [showHint, setShowHint] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(userChallengeProgress.solved)
  const [currentUserId, setCurrentUserId] = useState(3) //babaguhin if may login na

  useEffect(() => {
    if (!isActive && !isSubmitted) {
      setIsCorrect(null)
    }
    else if (isSubmitted) {
      setIsCorrect(true)
    }
  }, [isActive])

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === challenge.plaintext.trim().toLowerCase()
    setIsCorrect(correct)
    setIsSubmitted(correct)
    if (correct) {
      console.log(challenge.plaintext)
      // Update the UserChallengeProgress
      updateUserProgress(currentUserId, challenge.challengeId, true)
    }
    onSubmit(userAnswer, challenge.challengeId)
    setUserAnswer('')
  }

  let cardClass = 'cursor-pointer'

  if (isActive) {
    if (isCorrect) {
      cardClass += ' ring-2 ring-green-500'
    } else if (isCorrect == null) {
      cardClass += ' ring-2 ring-blue-500'
    } else {
      cardClass += ' ring-2 ring-red-500'
    }
  }

  return (
    <Card className={cardClass} onClick={onActivate}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-primary" />
            {challenge.title}
          </div>
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-semibold">{challenge.points} pts</span>
          </div>
        </CardTitle>
        <CardDescription>Type: {challenge.cipherType}, {challenge.cipherMode}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{challenge.description}</p>
        <div className="bg-muted p-4 rounded-md font-mono mb-4">
          {challenge.ciphertext}
        </div>
        {isActive && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                Time Limit: {challenge.timeLimit}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowHint(!showHint)
                }}
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            </div>
            {showHint && (
              <Card>
                <CardContent className="pt-6">
                  <HelpCircle className="h-4 w-4 inline mr-1" />
                  {challenge.hint}
                </CardContent>
              </Card>
            )}
            <Input
              type="text"
              placeholder="Enter your answer..."
              value={isSubmitted ? challenge.plaintext : userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={isSubmitted}
            />
            {!isSubmitted && (
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSubmit()
                }}
              >
                Submit Answer
              </Button>
            )}
            {isCorrect !== null && (
              <p className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                {isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!'}
              </p>
            )}
          </div>
        )}
        {!isActive && isSubmitted && (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your answer..."
              value={isSubmitted ? challenge.plaintext : userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={isSubmitted}
            />
            {isCorrect !== null && (
              <p className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                {isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Challenges() {
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [currentUserId, setCurrentUserId] = useState(3) //babaguhin if may login na
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([])

  const fetchLeaderboardData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/user/leaderboards')
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data')
      }
      const data = await response.json()
      setLeaderboardEntries(data)
    } catch (error) {
      console.error('Error fetching leaderboard data:', error)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboardData() // Initial fetch

    // Set up polling interval
    const intervalId = setInterval(fetchLeaderboardData, 5000) // Fetch every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [fetchLeaderboardData])

  useEffect(() => {
    if (activeChallengeId !== null) {
      const challenge = challenges.find(c => c.challengeId === activeChallengeId)
      setActiveChallenge(challenge || null)
    } else {
      setActiveChallenge(null)
    }
  }, [activeChallengeId, challenges])

  const handleSubmit = async (answer: string) => {
    if (activeChallenge) {
      // Update the challenge's completed status
      const updatedChallenges = challenges.map(c => 
        c.challengeId === activeChallenge.challengeId ? { ...c, completed: isCorrect } : c
      )
      setChallenges(updatedChallenges)



      const isCorrect = answer.trim().toLowerCase() === activeChallenge.plaintext.trim().toLowerCase()

      if (isCorrect) {
        // Update user points
        const newPoints = activeChallenge.points
        setUserPoints(newPoints)

        try {
          const response = await fetch("http://localhost:3000/updateprogress", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              userId: currentUserId,
              challengeId: activeChallenge.challengeId,
              solved: true
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to update points')
          }

          console.log('Points updated successfully')
          await fetchLeaderboardData()
        } catch (error) {
          console.error('Error updating points:', error)
        }
      }

    }
  }

  const handleSignUp = (username: string, password: string) => {
    // Implement sign up logic here
    console.log('Sign up:', username, password)
    setIsLoggedIn(true)
    setShowSignUp(false)
  }

  const handleLogin = (username: string, password: string) => {
    // Implement login logic here
    console.log('Login:', username, password)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        {showSignUp ? (
          <SignUp onSignUp={handleSignUp} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <Button
          variant="link"
          onClick={() => setShowSignUp(!showSignUp)}
          className="absolute bottom-4"
        >
          {showSignUp ? 'Already have an account? Log in' : 'Don\'t have an account? Sign up'}
        </Button>
      </div>
    )
  }

  const updateUserProgress = async (userId: number, challengeId: number, solved: boolean) => {
    try {
      const response = await fetch("http://localhost:3000/updateprogress", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, challengeId, solved }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user progress');
      }
  
      console.log('User progress updated successfully');
      // You might want to update your local state here as well
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cryptography Challenges</h1>
        <div>
          <Button variant="outline" onClick={() => setShowLeaderboard(!showLeaderboard)} className="mr-2">
            {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
          </Button>
          <Button variant="ghost" onClick={handleLogout}>Log out</Button>
        </div>
      </div>
      <p className="text-xl text-muted-foreground">Test your skills and level up your knowledge!</p>

      {showLeaderboard && (
        <Leaderboard entries={leaderboardEntries} />
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">Your Progress</h4>
              <p className="text-sm text-muted-foreground">
                Keep going! You're doing great.
              </p>
            </div>
            <div className="flex space-x-2">
              <Award className="h-6 w-6 text-yellow-500" />
              <Award className="h-6 w-6 text-gray-300" />
              <Award className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="beginner">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="beginner">
        <BeginnerChallenges
          activeChallengeId={activeChallengeId}
          setActiveChallengeId={setActiveChallengeId}
          onSubmit={handleSubmit}
          updateUserProgress={updateUserProgress}
          userId={currentUserId}
          />
        </TabsContent>
        <TabsContent value="intermediate">
          <IntermediateChallenges
            activeChallengeId={activeChallengeId}
            setActiveChallengeId={setActiveChallengeId}
            onSubmit={handleSubmit}
            updateUserProgress={updateUserProgress}
            userId={currentUserId}
          />
        </TabsContent>
        <TabsContent value="advanced">
          <AdvancedChallenges
            activeChallengeId={activeChallengeId}
            setActiveChallengeId={setActiveChallengeId}
            onSubmit={handleSubmit}
            updateUserProgress={updateUserProgress}
            userId={currentUserId}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Challenges Completed</div>
              <div className="text-2xl font-semibold flex items-center mt-1">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                3/10
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-semibold flex items-center mt-1">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                75%
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-2xl font-semibold flex items-center mt-1">
                <Trophy className="h-5 w-5 text-blue-500 mr-2" />
                {userPoints}
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="text-2xl font-semibold flex items-center mt-1">
                <Award className="h-5 w-5 text-purple-500 mr-2" />
                5 days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}