import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, BookOpenCheck, Flag, KeyRound, Grid, Shuffle, Fingerprint, History, ArrowRight, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"

const ciphers = [
  {
    name: 'Caesar Cipher',
    Icon: KeyRound,
    description: 'A substitution cipher that shifts letters by a fixed number of positions.',
    funFact: 'Named after Julius Caesar, who used it to communicate with his generals.',
    howItWorks: 'Each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.',
    example: 'With a shift of 3: "HELLO" becomes "KHOOR"'
  },
  {
    name: 'Vigenère Cipher',
    Icon: Grid,
    description: 'A polyalphabetic cipher using a keyword to shift letters differently at each position.',
    funFact: 'Known as "le chiffre indéchiffrable" (the unbreakable cipher) for 300 years.',
    howItWorks: 'Uses a keyword to determine the shift for each letter in the plaintext.',
    example: 'With keyword "KEY": "HELLO" might become "RIJVS"'
  },
  {
    name: 'Playfair Cipher',
    Icon: Shuffle,
    description: 'Uses pairs of letters and a 5x5 grid for encryption.',
    funFact: 'Created by Charles Wheatstone in 1854, but named after Lord Playfair who promoted its use.',
    howItWorks: 'Encrypts pairs of letters using a 5x5 grid of the alphabet (usually omitting Q).',
    example: 'The pair "HE" might be encrypted as "DM" depending on their positions in the grid.'
  },
  {
    name: 'Simple Substitution',
    Icon: Fingerprint,
    description: 'Each letter is replaced with another letter consistently throughout the message.',
    funFact: 'With 26! possible combinations, it\'s much more complex than the Caesar cipher.',
    howItWorks: 'Creates a random one-to-one mapping between letters of the alphabet.',
    example: 'If A->X, B->Y, C->Z, etc., "ABC" becomes "XYZ"'
  },
  {
    name: 'Rail Fence Cipher',
    Icon: History,
    description: 'A transposition cipher that arranges text in a zigzag pattern along a number of rails.',
    funFact: 'Popular in military communications during the American Civil War!',
    howItWorks: 'Writes the message in a zigzag pattern and then reads off each "rail" to form the ciphertext.',
    example: 'With 3 rails, "HELLO WORLD" becomes "HOLELWRDLO"'
  }
]

export default function Home() {
  const [solution, setSolution] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [randomChallenge, setRandomChallenge] = useState<any>(null)
  const [currentCipherIndex, setCurrentCipherIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')

  useEffect(() => {
    const fetchRandomChallenge = async () => {
      try {
        const response = await fetch('http://localhost:3000/challenges/random')
        if (!response.ok) {
          throw new Error('Failed to fetch challenge')
        }
        const challenge = await response.json()
        setRandomChallenge(challenge)
      } catch (error) {
        console.error('Error fetching challenge:', error)
      }
    }

    fetchRandomChallenge()
  }, [])

  const checkSolution = () => {
    if (randomChallenge) {
      const correct = solution.toLowerCase() === randomChallenge.plaintext.toLowerCase()
      setFeedback(correct ? 'correct' : 'incorrect')
    }
  }

  const nextCipher = () => {
    setSlideDirection('right')
    setCurrentCipherIndex((prevIndex) => (prevIndex + 1) % ciphers.length)
  }

  const prevCipher = () => {
    setSlideDirection('left')
    setCurrentCipherIndex((prevIndex) => (prevIndex - 1 + ciphers.length) % ciphers.length)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to CryptoLearn!
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Discover the fascinating world of classical cryptography through interactive learning.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>
                    <Lock className="inline-block mr-2 text-primary" size={24} /> Start Learning
                </CardTitle>
                <CardDescription>
                    Begin your cryptography journey with our interactive tools and comprehensive lessons.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Link to="/ciphers">
                    <Button variant="default" className="group">
                        Explore Ciphers <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>
                    <BookOpenCheck className="inline-block mr-2 text-primary" size={24} /> Practice
                </CardTitle>
                <CardDescription>Test your knowledge with interactive exercises and hands-on encryption practice.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Link to="/challenges">
                    <Button variant="default" className="group">
                        Start Practicing <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    </div>


      {randomChallenge && (
        <Card className='hover:shadow-lg transition-shadow relative'>
          <CardHeader>
            <CardTitle><Flag className="inline-block mr-2 text-primary" size={24} /> Try This!</CardTitle>
            <CardDescription>Can you crack this cipher?</CardDescription>
            <p className="text-sm text-muted-foreground mt-2">
              Cipher Type: <strong>{randomChallenge.cipherType}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg mb-4 p-4 bg-secondary/30 rounded-md text-center">
              {randomChallenge.ciphertext}
            </p>
            <div className="flex flex-col space-y-4">
              <Button 
                variant="link" 
                onClick={() => setShowHint(!showHint)} 
                className="self-start"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              {showHint && (
                <p className="text-sm text-muted-foreground mb-4 bg-secondary/30 p-3 rounded-md">
                  {randomChallenge.hint}
                </p>
              )}
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Type your answer here"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full"
                />
                <Button onClick={checkSolution} className="flex mx-auto items-center justify-center">
                  <CheckCircle className="mr-2" size={20} />
                  Check Solution
                </Button>
              </div>
              {feedback && (
                <motion.p 
                  className={`text-center ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {feedback === 'correct' ? (
                    <><CheckCircle className="inline-block mr-2" /> Correct! Well done!</>
                  ) : (
                    <><XCircle className="inline-block mr-2" /> Not quite. Try again!</>
                  )}
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

<div>
        <h2 className="text-3xl font-bold text-center mb-8">Explore Classical Ciphers</h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCipherIndex}
              initial={{ 
                opacity: 0, 
                x: slideDirection === 'right' ? 300 : -300 
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: slideDirection === 'right' ? -300 : 300 
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                duration: 0.5 
              }}
              className="w-full"
            >
              <Card className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      {React.createElement(ciphers[currentCipherIndex].Icon, { className: "mr-2 h-6 w-6 text-primary" })}
                      {ciphers[currentCipherIndex].name}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={prevCipher}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={nextCipher}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{ciphers[currentCipherIndex].description}</p>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Fun Fact</h3>
                      <p className="text-sm">{ciphers[currentCipherIndex].funFact}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">How It Works</h3>
                      <p className="text-sm">{ciphers[currentCipherIndex].howItWorks}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Example</h3>
                      <p className="text-sm">{ciphers[currentCipherIndex].example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

