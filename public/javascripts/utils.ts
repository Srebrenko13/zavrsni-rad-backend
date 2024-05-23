export class Utils{
    systemSetup(){
        return `
        I would like you to create nonlinear storytelling game with 5 chapters story based 
        on a given theme or short description. I need you to generate answer as JSON object 
        with next fields: "story" (a short story for a given input), "description" (one 
        sentence description of story), "1", "2", "3" (three possible choices for next
        chapter of the game).
    `
    }
}