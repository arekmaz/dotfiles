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

vim.g.mapleader = " "

local themePlugin =
  {
    "shaunsingh/nord.nvim",
    config = function()
      vim.cmd("colorscheme nord")
    end,
  }
  -- {
  --   "rebelot/kanagawa.nvim",
  --   config = function()
  --     vim.cmd("colorscheme kanagawa")
  --   end,
  -- }
  -- {
  --   "catppuccin/nvim",
  --   config = function()
  --     require("catppuccin").setup({
  --       flavour = "latte",
  --     flavour = "auto", -- latte, frappe, macchiato, mocha
  --     });
  --     vim.cmd("colorscheme catppuccin")
  --   end,
  -- }
  -- {
  --   "rose-pine/neovim",
  --   config = function()
  --     require("rose-pine").setup({
  --       variant = "dawn",
  --       -- variant = "auto", -- auto, main, moon, or dawn
  --     });
  --     vim.cmd("colorscheme rose-pine")
  --   end,
  -- }

require("lazy").setup({
  "djoshea/vim-autoread",
  "ckipp01/stylua-nvim",
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
    "nvim-treesitter/nvim-treesitter",
    run = function()
      local ts_update = require("nvim-treesitter.install").update({ with_sync = true })
      ts_update()
    end,
  },
  "mbbill/undotree",
  themePlugin,
  {
    "echasnovski/mini.nvim",
    -- requires = {
    --   "lewis6991/gitsigns.nvim"
    -- },
    config = function()
      require("mini.surround").setup()
      -- require("mini.align").setup()
      -- require("mini.files").setup()
      require("mini.comment").setup()
      -- require("mini.indentscope").setup()
      require("mini.jump").setup()
      require("mini.jump2d").setup()
      -- require("mini.statusline").setup()
      -- require("mini.basics").setup()
    end,
  },
  {
    "windwp/nvim-autopairs",
    config = function()
      require("nvim-autopairs").setup({})
    end,
  },
  "nvim-treesitter/nvim-treesitter-context",
  {
    "VonHeikemen/lsp-zero.nvim",
    dependencies = {
      -- LSP Support
      { "neovim/nvim-lspconfig" },
      { "williamboman/mason.nvim" },
      {
        "williamboman/mason-lspconfig.nvim",
      },

      -- Autocompletion
      { "hrsh7th/nvim-cmp" },
      { "hrsh7th/cmp-buffer" },
      { "hrsh7th/cmp-path" },
      { "saadparwaiz1/cmp_luasnip" },
      { "hrsh7th/cmp-nvim-lsp" },
      { "hrsh7th/cmp-nvim-lua" },

      -- Snippets
      { "L3MON4D3/LuaSnip" },
      { "rafamadriz/friendly-snippets" },

      -- { "laureanray/tailwindcss-language-server" },
    },
  },

  -- "github/copilot.vim",

  -- prettier
  "neovim/nvim-lspconfig",
  "jose-elias-alvarez/null-ls.nvim",
  "MunifTanjim/prettier.nvim",
  { "chrisgrieser/nvim-spider", lazy = true },
})

require('arek')
