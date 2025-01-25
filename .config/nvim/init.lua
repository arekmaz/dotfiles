-- load vimrc
vim.cmd([[
  set runtimepath^=~/.vim runtimepath+=~/.vim/after
  let &packpath = &runtimepath
  source ~/.vimrc


  "configs specific to nvim

  "restore the default vim grepprg
  set grepprg=grep\ -n\ $*\ /dev/null
  set grepformat=%f:%l:%m,%f:%l%m,%f\ \ %l%m

  "diable gc commenting, vim doesn't have it
  ounmap gc
  nunmap gc
  xunmap gc
  nunmap gcc
]])


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

local themePlugin = {
  "zenbones-theme/zenbones.nvim",
  config = function()
    vim.g.zenbones = { transparent_background = true }
    vim.cmd("colorscheme zenbones")
  end,
  dependencies = { { "rktjmp/lush.nvim" }, },
}

require("lazy").setup({
  themePlugin,
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
      { "hrsh7th/cmp-nvim-lsp" },
      {
        "nvimtools/none-ls.nvim",
        dependencies = {
          "nvimtools/none-ls-extras.nvim",
          "nvim-lua/plenary.nvim"
        },
      },
      { "hrsh7th/cmp-nvim-lua" }, },
    },
  "djoshea/vim-autoread",
  {
    'stevearc/oil.nvim',
    dependencies = { "nvim-tree/nvim-web-devicons" },
    opts = {},
    lazy = false,
  },
})

require("oil").setup()
