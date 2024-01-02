import './index.css'
import { useState, useEffect, useCallback, useRef } from 'react'

const wordsTypeObj = [
    { type: 'bigrams', id: 2 },
    { type: 'trigrams', id: 3 },
    { type: 'tetragrams', id: 4 }
]

const Typer = () => {
    const keysArr = ['1', 'a', 's', 'd', 'f', 'j', 'Control', 'Alt', ' ', '0', 'k', 'l', ';', 'Enter']
    const [words, setWords] = useState('asdfjkl;')
    const [input, setInput] = useState('')
    const [isInputCorrect, setIsInputCorrect] = useState(false)
    const [wordsType, setWordsType] = useState(wordsTypeObj[0].type)
    const [practiceWords, setPracticeWords] = useState('as sa as sa')
    const [start, setStart] = useState(0)
    const [count, setCount] = useState(2)
    const [totalSeconds, setTotalSeconds] = useState(20)
    const [isTimerStarted, startTimer] = useState(false)
    const [totalWords, setTotalWords] = useState(0)
    const [correctWords, setCorrectWords] = useState(0)
    const [countKeysTypes, setKeysTyped] = useState(0)
    const [session, setSession] = useState(1)
    const [uniqueId, setUniqueId] = useState(null)
    const [inputKey, setInputKey] = useState(null)
    const inputRef = useRef(null);

    useEffect(() => {
        if (isTimerStarted) { inputRef.current.focus() }
    })

    if (isTimerStarted && totalSeconds === 0) {
        clearInterval(uniqueId)
        startTimer(false)
    }

    const resetTimer = () => {
        setIsInputCorrect(false)
        setInput('')
        setTotalSeconds(20)
        setWordsType(wordsTypeObj[0].type)
        setPracticeWords('as sa as sa')
        setCount(0)
        setTotalWords(0)
        setCorrectWords(0)
        setKeysTyped(0)
        setSession(1)
        setUniqueId(null)
        setInputKey(null)
    }

    if (totalSeconds === 0) {
        resetTimer()
    }

    let startCountDown = useCallback(() => {
        let unique
        const timeFunction = () => {
            setUniqueId(unique)
            setTotalSeconds((prev) => prev - 1)
        }
        unique = setInterval(() =>
            timeFunction()
            , 1000);
    }, [])

    const onChangeWordType = (event) => {
        const { value } = event.target
        if (value === 'bigrams') {
            setCount(2)
            randommize()
            setWordsType(value)
        } else if (value === 'trigrams') {
            setCount(3)
            randommize()
            setWordsType(value)
        } else {
            setCount(4)
            randommize()
            setWordsType(value)
        }
    }

    const randommize = () => {
        const wordsList = words.split('')
        for (let i = wordsList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordsList[i], wordsList[j]] = [wordsList[j], wordsList[i]];
        }
        setWords(wordsList.join(''))
    }

    useEffect(() => {
        let chars = words.slice(start, count)
        let word = '';
        for (let a = 1; a < 5; a++) {
            if (a <= 3) {
                if (a % 2 === 0) {
                    word += chars.split('').sort((a, b) => b.localeCompare(a)).join('') + ' '
                } else {
                    word += chars.split('').sort((a, b) => a.localeCompare(b)).join('') + ' '
                }
            }
            else {
                word += chars
            }
        }
        if (isInputCorrect) {
            setIsInputCorrect(false)
        }
        setPracticeWords(word)

    }, [isInputCorrect, wordsType])

    const checkAccuracy = (key) => {
        let countOfInput = input.length - 1
        if (practiceWords.at(countOfInput) === key) {
            setCorrectWords((prev) => prev + 1)
        }
    }

    const onClickStartButton = () => {
        startTimer(true)
        startCountDown()
    }

    const onClick9Button = () => {
        setIsInputCorrect(true)
        randommize()
        setSession((prev) => prev + 1)
        setInput('')
    }
    const onChangeInput = (event) => {
        const { value } = event.target
        setInput(value)
        setInput(value)
        setKeysTyped((prev) => prev + 1)
        setTotalWords((prev) => prev + 1)
        if (value === '0') {
            resetTimer()
        }
        if (value === '9') {
            onClick9Button()
        }
    }

    const onKeyDownEventTriggered = (event) => {
        if (event.key === '1') {
            setInput('')
        }
        setInputKey(event.key)
    }

    const onKeyUpEventTriggered = (event) => {
        const { key } = event
        if (key === '1') {
            setInput('')
        }
        checkAccuracy(event.key)
        if (input === practiceWords) {
            setSession((prev) => prev + 1)
            setInput('')
            setIsInputCorrect(true)
            randommize()
        }
    }



    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const wordsPerMinute = Math.round((correctWords / 5) * 60)
    const accuracy = Math.round((correctWords / countKeysTypes) * 100, 1)
    const averageWPM = Math.floor(totalWords / session)
    return <div className='main-div'>
        <nav className='navbar'>
            <p>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</p>
            <p >Typing Pro</p>
        </nav>
        <div className='botton-div'>
            <h1 className='main-heading'>Typing Practice</h1>
            <p className='session'>Session: {session}</p>

            <select className='select-element' onChange={onChangeWordType}>
                {wordsTypeObj.map(((each) =>
                    <option key={each.id} value={each.type}>{each.type}</option>
                ))}
            </select>
            <div className='keys-container'>
                {keysArr.map((each) =>
                    <div key={each} className={inputKey === each ? 'keys keysPressed' : 'keys'}>{each === ' ' ? 'Space' : each === 'Control' ? 'Ctrl' : each}</div>
                )}
            </div>
            <div className='input-container'>
                <p className='words'>{practiceWords}</p>
                {isTimerStarted ? <input
                    ref={inputRef}
                    className='input'
                    placeholder={isTimerStarted ? 'press 1 to clear, 0 to reset' : 'Start Typing'}
                    type='text'
                    value={input}
                    onChange={onChangeInput}
                    onKeyDown={onKeyDownEventTriggered}
                    onKeyUp={onKeyUpEventTriggered}
                /> : <button className='button' type='button' onClick={onClickStartButton}>Start
                </button>}
                <div className='result-container'>
                    <h1 className='result-heading'>WPM: {wordsPerMinute}</h1>
                    <h1 className='result-heading'>Accuracy: {accuracy || 0}%</h1>
                    <h1 className='result-heading'>Average WPM: {averageWPM}</h1>
                </div>
            </div>
        </div>
    </div>
}

export default Typer

