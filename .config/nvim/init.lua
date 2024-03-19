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

vim.opt.rtp:prepend(lazypath)

-- Example using a list of specs with the default options
vim.g.mapleader = " " -- Make sure to set `mapleader` before lazy so your mappings are correct

require("lazy").setup({
  {
    "nvim-telescope/telescope.nvim",
    tag = "0.1.5",
    dependencies = { { "nvim-lua/plenary.nvim" },
      { 'nvim-telescope/telescope-fzf-native.nvim', build = 'make' },
      {
        "nvim-telescope/telescope-file-browser.nvim",
      }
    },
  },
  {
    "shaunsingh/nord.nvim",
    config = function()
      vim.cmd("colorscheme nord")
    end,
  },
  {
    "VonHeikemen/lsp-zero.nvim",
    dependencies = {
      -- LSP Support
      { "neovim/nvim-lspconfig" },
      { "williamboman/mason.nvim" },
      { "williamboman/mason-lspconfig.nvim" },
      {'hrsh7th/cmp-nvim-lsp'},
      {'hrsh7th/nvim-cmp'},
    },
  },


  "github/copilot.vim",

  -- prettier
  "neovim/nvim-lspconfig",
  "jose-elias-alvarez/null-ls.nvim",
  "MunifTanjim/prettier.nvim",
  {
    "echasnovski/mini.nvim",
    -- requires = {
    --   "lewis6991/gitsigns.nvim"
    -- },
    config = function()
      require("mini.surround").setup()
      require("mini.comment").setup()
      require("mini.indentscope").setup()
      require("mini.jump").setup()
      require("mini.jump2d").setup()
      -- require("mini.statusline").setup()
    end,
  },
})

require('arek')
