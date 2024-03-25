vim.g.mapleader = " "
local MiniFiles = require('mini.files')

vim.keymap.set("n", "<leader>pv", vim.cmd.Ex)

vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")

-- greatest remap ever

vim.keymap.set(
	{ "n", "o", "x" },
  "gy",
  '"+y'
)

vim.keymap.set("n", "<C-\\>", "<cmd>vsp<CR>")

-- replace occurences word under cursor
vim.keymap.set("n", "<leader>S", [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]])

