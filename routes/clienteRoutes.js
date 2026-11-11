const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/clientes.json");

const dadosIniciais = [
    {
        id: 1,
        nome: "John Doe",
        email: "john.doe@example.com",
        telephone: "123-456-7890"
    },
    {
        id: 2,
        nome: "Jane Smith",
        email: "jane.smith@example.com",
        telephone: "098-765-4321"
    },
    {
        id: 3,
        nome: "Bob Johnson",
        email: "bob.johnson@example.com",
        telephone: "555-555-5555"
    }
];

function lerClientes() {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(dadosIniciais, null, 2), "utf-8");
    }
    const dados = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(dados || "[]");
}

function salvarClientes(clientes) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(clientes, null, 2), "utf-8");
}

router.get("/", (req, res) => {
    const clientes = lerClientes();
    res.render("clientes/index", {
        clientes: clientes
    });
});

router.get("/cadastro", (req, res) => {
    res.render("clientes/form-cadastro");
});

router.post("/", (req, res) => {
    const clientes = lerClientes();
    const { nome, email, telephone } = req.body;

    const novoCliente = {
        id: clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1,
        nome: nome,
        email: email,
        telephone: telephone
    };

    clientes.push(novoCliente);
    salvarClientes(clientes);

    res.redirect("/clientes");
});

// Excluir
router.get("/excluir/:id", (req, res) => {
    let clientes = lerClientes();
    let id = parseInt(req.params.id);
    clientes = clientes.filter(c => c.id !== id);
    salvarClientes(clientes);
    res.redirect("/clientes");
});

// Editar - form - GET
router.get("/editar/:id", (req, res) => {
    const clientes = lerClientes();
    let id = parseInt(req.params.id);
    const clienteEncontrado = clientes.find(c => c.id === id);

    if (!clienteEncontrado) {
        return res.redirect("/clientes");
    }

    res.render("clientes/editar", { cliente: clienteEncontrado });
});

// Editar - efetiva - POST
router.post("/editar/:id", (req, res) => {
    const clientes = lerClientes();
    let id = parseInt(req.params.id);
    const { nome, email, telephone } = req.body;
    const index = clientes.findIndex(c => c.id === id);
    if (index !== -1) {
        clientes[index] = { id, nome, email, telephone };
        salvarClientes(clientes);
    }
    res.redirect("/clientes");
});

module.exports = router;
