const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/fornecedores.json");

const dadosIniciais = [
    {
        id: 1,
        rasaoSocial: "Nike",
        cnpj: "43.761.092/0001-85",
        email: "Nike@gmail.com",
        telephone: "(11) 3214-5500",
        cidade: "São Paulo"
    },
    {
        id: 2,
        rasaoSocial: "Samsung",
        cnpj: "18.236.449/00001-0000",
        email: "Samsung@gmail.com",
        telephone: "(11) 4004-0000",
        cidade: "Campinas"
    },
    {
        id: 3,
        rasaoSocial: "Zara",
        cnpj: "29.873.115/0001-44",
        email: "Zara@gmail.com",
        telephone: "(21) 2503-9100",
        cidade: "Rio de Janeiro"
    }
];

function lerFornecedores() {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(dadosIniciais, null, 2), "utf-8");
    }
    const dados = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(dados || "[]");
}

function salvarFornecedores(fornecedores) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(fornecedores, null, 2), "utf-8");
}

// Listagem (Read)
router.get("/", (req, res) => {
    const fornecedores = lerFornecedores();
    res.render("fornecedores/index", {
        fornecedores: fornecedores
    });
});

// Formulário de Cadastro (GET)
router.get("/cadastro", (req, res) => {
    res.render("fornecedores/form-cadastro");
});

// Efetivar Cadastro (Create - POST)
router.post("/", (req, res) => {
    const fornecedores = lerFornecedores();
    const { rasaoSocial, cnpj, email, telephone, cidade } = req.body;

    const novoFornecedor = {
        id: fornecedores.length > 0 ? fornecedores[fornecedores.length - 1].id + 1 : 1,
        rasaoSocial: rasaoSocial,
        cnpj: cnpj,
        email: email,
        telephone: telephone,
        cidade: cidade
    };

    fornecedores.push(novoFornecedor);
    salvarFornecedores(fornecedores);

    res.redirect("/fornecedores");
});

// Excluir (Delete - GET)
router.get("/excluir/:id", (req, res) => {
    let fornecedores = lerFornecedores();
    let id = parseInt(req.params.id);
    fornecedores = fornecedores.filter(f => f.id !== id);
    salvarFornecedores(fornecedores);
    res.redirect("/fornecedores");
});

// Formulário de Editar (GET)
router.get("/editar/:id", (req, res) => {
    const fornecedores = lerFornecedores();
    let id = parseInt(req.params.id);
    const fornecedorEncontrado = fornecedores.find(f => f.id === id);

    if (!fornecedorEncontrado) {
        return res.redirect("/fornecedores");
    }

    res.render("fornecedores/editar", { fornecedor: fornecedorEncontrado });
});

// Efetivar Edição (Update - POST)
router.post("/editar/:id", (req, res) => {
    const fornecedores = lerFornecedores();
    let id = parseInt(req.params.id);
    const { rasaoSocial, cnpj, email, cidade, telephone } = req.body;
    const index = fornecedores.findIndex(f => f.id === id);

    if (index !== -1) {
        fornecedores[index] = { id, rasaoSocial, cnpj, email, cidade, telephone };
        salvarFornecedores(fornecedores);
    }
    res.redirect("/fornecedores");
});

module.exports = router;
