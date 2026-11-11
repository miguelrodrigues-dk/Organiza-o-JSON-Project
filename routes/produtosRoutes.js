const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/produtos.json");

const dadosIniciais = [
    {
        id: 1,
        nome: "Tênis",
        descricao: "Tênis esportivo",
        preco: 199.99,
        estoque: 10,
        categoria: "Calçados"
    },
    {
        id: 2,
        nome: "Notebook",
        descricao: "Notebook gamer",
        preco: 5999.99,
        estoque: 5,
        categoria: "Informática"
    },
    {
        id: 3,
        nome: "Camiseta",
        descricao: "Camiseta de algodão",
        preco: 49.99,
        estoque: 20,
        categoria: "Roupas"
    }
];

function lerProdutos() {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(dadosIniciais, null, 2), "utf-8");
    }
    const dados = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(dados || "[]");
}

function salvarProdutos(produtos) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(produtos, null, 2), "utf-8");
}

// Listagem (Read)
router.get("/", (req, res) => {
    const produtos = lerProdutos();
    res.render("produtos/index", {
        produtos: produtos
    });
});

// Formulário de Cadastro (GET)
router.get("/cadastro", (req, res) => {
    res.render("produtos/form-cadastro");
});

// Efetivar Cadastro (Create - POST)
router.post("/", (req, res) => {
    const produtos = lerProdutos();
    const { nome, descricao, preco, estoque, categoria } = req.body;

    const novoProduto = {
        id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria: categoria
    };

    produtos.push(novoProduto);
    salvarProdutos(produtos);

    res.redirect("/produtos");
});

// Excluir (Delete - GET)
router.get("/excluir/:id", (req, res) => {
    let produtos = lerProdutos();
    let id = parseInt(req.params.id);
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutos(produtos);
    res.redirect("/produtos");
});

// Formulário de Editar (GET)
router.get("/editar/:id", (req, res) => {
    const produtos = lerProdutos();
    let id = parseInt(req.params.id);
    const produtoEncontrado = produtos.find(p => p.id === id);

    if (!produtoEncontrado) {
        return res.redirect("/produtos");
    }

    res.render("produtos/editar", { produto: produtoEncontrado });
});

// Efetivar Edição (Update - POST)
router.post("/editar/:id", (req, res) => {
    const produtos = lerProdutos();
    let id = parseInt(req.params.id);
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const index = produtos.findIndex(p => p.id === id);

    if (index !== -1) {
        produtos[index] = {
            id,
            nome,
            descricao,
            preco: parseFloat(preco),
            estoque: parseInt(estoque),
            categoria
        };
        salvarProdutos(produtos);
    }
    res.redirect("/produtos");
});

module.exports = router;
