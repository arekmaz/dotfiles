vim.g.mapleader = " "

vim.keymap.set(
	{ "n", "o", "x" },
  "<leader>y",
  '"+y'
)

vim.keymap.set(
	{ "n", "o", "x" },
  "<leader>l",
  ':ls<cr>:b<space>'
)

vim.keymap.set("n", "<C-\\>", "<cmd>vsp<CR>")
vim.keymap.set("n", "<C-h>", "<cmd>bprevious<CR>")
vim.keymap.set("n", "<C-l>", "<cmd>bnext<CR>")
vim.keymap.set("n", "!!", ":!")

