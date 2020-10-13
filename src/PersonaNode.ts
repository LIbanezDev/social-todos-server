export interface IPersona {
    id: number,
    name: string,
    age: number,
    bornDate: string
}

class PersonaNode {
    data: IPersona
    next: null | PersonaNode

    constructor(data: IPersona, next: null | PersonaNode) {
        this.data = data
        this.next = next
    }
}

export default PersonaNode
