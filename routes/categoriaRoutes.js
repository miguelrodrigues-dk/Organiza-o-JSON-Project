const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/categorias.json");

const dadosIniciais = [
    {
        id: 1,
        nome: "Informática",
        descricao: "Produtos e serviços de informática"
    },
    {
        id: 2,
        nome: "Eletrônicos",
        descricao: "Produtos eletrônicos"
    },
    {
        id: 3,
        nome: "Roupas",
        descricao: "Roupas e acessórios"
    }
];

function lerCategorias() {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(dadosIniciais, null, 2), "utf-8");
    }
    const dados = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(dados || "[]");
}

function salvarCategorias(categorias) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(categorias, null, 2), "utf-8");
}

// Listagem
router.get("/", (req, res) => {
    const categorias = lerCategorias();
    res.render("categorias/index", {
        categorias: categorias
    });
});

// Formulário de Cadastro (GET)
router.get("/cadastro", (req, res) => {
    res.render("categorias/form-cadastro");
});

// Efetivar Cadastro (POST)
router.post("/", (req, res) => {
    const categorias = lerCategorias();
    const { nome, descricao } = req.body;
    const novaCategoria = {
        id: categorias.length > 0 ? categorias[categorias.length - 1].id + 1 : 1,
        nome: nome,
        descricao: descricao
    };
    categorias.push(novaCategoria);
    salvarCategorias(categorias);
    res.redirect("/categorias");
});

// Excluir (GET)
router.get("/excluir/:id", (req, res) => {
    let categorias = lerCategorias();
    let id = parseInt(req.params.id);
    categorias = categorias.filter(c => c.id !== id);
    salvarCategorias(categorias);
    res.redirect("/categorias");
});

// Formulário de Editar (GET)
router.get("/editar/:id", (req, res) => {
    const categorias = lerCategorias();
    let id = parseInt(req.params.id);
    const categoriaEncontrada = categorias.find(c => c.id === id);

    if (!categoriaEncontrada) {
        return res.redirect("/categorias");
    }
    res.render("categorias/editar", { categoria: categoriaEncontrada });
});

// Editar - efetiva - POST
router.post("/editar/:id", (req, res) => {
    const categorias = lerCategorias();
    let id = parseInt(req.params.id);
    const { nome, descricao } = req.body;

    const index = categorias.findIndex(c => c.id === id);
    if (index !== -1) {
        categorias[index].nome = nome;
        categorias[index].descricao = descricao;
        salvarCategorias(categorias);
    }

    res.redirect("/categorias");
});

module.exports = router;
