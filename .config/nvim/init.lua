vim.g.mapleader = " " -- Make sure to set `mapleader` before lazy so your mappings are correct

local o = vim.opt
local g = vim.g

local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"

if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end

o.rtp:prepend(lazypath)

require("lazy").setup({
  {
    "shaunsingh/nord.nvim",
    config = function()
      vim.cmd("colorscheme nord")
    end,
  },
  "github/copilot.vim",
  {'williamboman/mason.nvim'},
  {'williamboman/mason-lspconfig.nvim'},
  {'VonHeikemen/lsp-zero.nvim', branch = 'v3.x'},
  {'neovim/nvim-lspconfig'},
  {'hrsh7th/cmp-nvim-lsp'},
  {'hrsh7th/nvim-cmp'},
  {'L3MON4D3/LuaSnip'},
})



o.guicursor = ""

o.nu = true
o.relativenumber = false

o.tabstop = 2
o.softtabstop = 2
o.shiftwidth = 2
o.expandtab = true

o.smartindent = true

o.smartcase = true
o.ignorecase = true

o.wrap = true

-- o.autochdir = true

o.swapfile = false
o.backup = false
o.undodir = os.getenv("HOME") .. "/.vim/undodir"
o.undofile = true

-- o.hlsearch = true
o.incsearch = true

o.termguicolors = true

o.scrolloff = 8
o.signcolumn = "no"
o.isfname:append("@-@")

o.updatetime = 50

o.colorcolumn = "80"

o.guicursor = "i:ver80-Cursor"

o.history = 10000
o.path = "**"

g.netrw_liststyle=3

g.netrw_list_hide = ".*\\.swp$,.DS_Store,*/tmp/*,*.so,*.swp,*.zip,*.git,^\\.\\.\\=/\\=$"

o.wildignore = '*/node_modules/*,*/.git/*'

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})

  -- https://github.com/VonHeikemen/lsp-zero.nvim/blob/14c9164413df4be17a5a0ca9e01a376691cbcaef/lua/lsp-zero/server.lua#L101
  vim.keymap.set('n', '<leader>.', '<cmd>lua vim.lsp.buf.code_action()<cr>', {buffer = buffer, desc = 'Execute code action'})


end)

require('mason').setup({})
require('mason-lspconfig').setup({
  -- Replace the language servers listed here 
  -- with the ones you want to install
  ensure_installed = {'tsserver', 'rust_analyzer'},
  handlers = {
    lsp_zero.default_setup,
  },
})

require'lspconfig'.tsserver.setup({})
require'lspconfig'.marksman.setup({})
