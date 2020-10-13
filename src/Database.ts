import {DataTypes, Model, Optional, Sequelize} from "sequelize";

const sequelize = new Sequelize("mysql://fromiti:123456@localhost:3306/todo_list");

sequelize.authenticate()
    .then(value => console.log('Authenticated to db'))
    .catch(err => console.log('Not authenticated' + err))

// We recommend you declare an interface for the attributes, for stricter typechecking
interface UserAttributes {
    id: number;
    name: string;
}

// Some fields are optional when calling UserModel.create() or UserModel.build()
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
}

// We need to declare an interface for our model that is basically what our class would be
interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
        UserAttributes {
}
const UserModel = sequelize.define<UserInstance>("User", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED
    },
    name: {
        type: DataTypes.STRING
    }
})

async function getAll():Promise<UserAttributes[]> {
    return await UserModel.findAll()
}

export {
    getAll
}
