import PersonaNode from "./PersonaNode";

class LinkedList {
    private base: null | PersonaNode

    constructor(base: null | PersonaNode) {
        this.base = base
    }

    public size() {
        let iterator = this.base
        let sumaSize = 0
        while (iterator != null) {
            sumaSize++
            iterator = iterator.next
        }
        return sumaSize;
    }

    public clear() {
        this.base = null
    }

    public getLast() {
        let iterator = this.base
        if (iterator) {
            while (iterator) {
                iterator = iterator.next
            }
        }
        return iterator
    }

    public getFirst() {
        return this.base
    }

}

export default LinkedList
