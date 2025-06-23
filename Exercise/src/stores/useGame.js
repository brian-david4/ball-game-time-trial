import {create} from 'zustand';
import { subscribeWithSelector } from "zustand/middleware";


export default create(subscribeWithSelector((set) => {
    
    
    
    
    return {
        blocksCount: 10,
        blockSeed: 0,
        // Phases of game
        phase: 'ready',
        startTime: 0,
        endTime: 0,
        highScore: 0,
        start: () => 
        {
            set((state) => {
                if(state.phase === 'ready') {
                    return { phase: 'playing', startTime: Date.now()}
                }
                return {}
            })
        },
        end: () => 
        {
            set((state) => {
                if(state.phase === 'playing'){
                    return {phase: 'ended', endTime: Date.now()}
                } 
                return {}
            })
        },
        restart: () => 
        {
            set((state) => {
                if(state.phase === 'playing' | state.phase === 'ended')
                {
                    return {phase: 'ready', blockSeed: Math.random()}
                } 
                return {}
            })
        },
        // Score
        setHighScore: (score) => 
        {
            set((state) => {
                 return ({highScore: score})
            })
        } 
    }
}))

// score = 10 // new highscore 
// highscore = 11 // old highscore

// defaultStore = 0