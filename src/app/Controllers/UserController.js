const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const yup = require('yup');
const axios = require('axios');

class UserController {
    show(req, res) {
        let users = ["Robert", "Lacy", "Danvers"]
        
        return res.status(200).json({
            error: false,
            users
        })
    }

    async store(req, res) {

        // === Validação através do YUP schema
        // === Início
        let schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required(),
            age: yup.number().required(),
            phone: yup.string().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: true,
                message: "Dados inválidos"
            })
        }
        // === Validação através do YUP schema 
        // === Fim
        
        // === Validação no banco de dados 
        // === Verifica se o usuário existe
        let userExist = await User.findOne({ email: req.body.email });
            if(userExist) {
                return res.status(400).json({
                error: true,
                message: "Este usuário já existe!"
            })
        }

        // === Desestrutuação dos dados da requisição
        const { name, email, password, age, phone } = req.body;

        // === criação da constante data
        const data = { name, email, password, age, phone };

        // === Criptografia da senha
        data.password = await bcrypt.hash(data.password, 8);

        // === Inserção no Banco de Dados
        await User.create(data, (err) => {
            if(err) return res.status(400).json({
                error: true,
                message: "Erro ao tentar inserir usuário no MongoDB"
            })

            return res.status(200).json({
                error: false,
                message: "Usuário cadastrado com sucesso"
            })
        })
    }
}

module.exports = new UserController();
