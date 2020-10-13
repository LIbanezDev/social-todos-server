import express from 'express'
import PersonaNode, {IPersona} from "./PersonaNode";
import LinkedList from "./LinkedList";
import bodyParser from "body-parser";

const app: express.Application = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.post('/api', (req: express.Request, res: express.Response) => {

    res.send({
        data: {
            test: "Hola",
            ...req.params,
            ...req.body
        }
    })
})

app.get('/', async function (req: express.Request, res: express.Response) {

    const user_one = new PersonaNode({
        id: 1,
        name: "Lucas",
        bornDate: "18/01/2001",
        age: 19
    }, null)

    const user_two = new PersonaNode({
        id: 2,
        name: "Lucas Two",
        bornDate: "18/01/2002",
        age: 20
    }, null)

    user_one.next = user_two
    const linkedPersonas = new LinkedList(user_one)
    const size: number = linkedPersonas.size()
    const last: any = linkedPersonas.getLast()
    const first: PersonaNode | null = linkedPersonas.getFirst()
    res.status(200).json({
        listSize: size,
        first: first?.data,
        last: last?.data
    })
})

app.listen(3000, () => {
    console.log('Listening port 3000')
})

