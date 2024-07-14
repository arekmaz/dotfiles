local lsp = require("lsp-zero")

vim.lsp.set_log_level("off")

lsp.set_preferences({
  suggest_lsp_servers = false,
  sign_icons = {
    error = 'E',
    warn = 'W',
    hint = 'H',
    info = 'I'
  },
})

local function organize_imports()
  local params = {
    command = "typescript.organizeImports",
    arguments = { vim.api.nvim_buf_get_name(0) },
    title = ""
  }
  vim.lsp.buf.execute_command(params)
end

local function select_ts_version()
  local params = {
    command = "typescript.selectTypeScriptVersion",
    arguments = { vim.api.nvim_buf_get_name(0) },
    title = ""
  }
  vim.lsp.buf.execute_command(params)
end

local on_attach = function(client, bufnr)
  lsp.default_keymaps({ buffer = bufnr })

  local opts = { buffer = bufnr, remap = false }

  vim.cmd('compiler tsc')
  vim.opt.makeprg = "npx tsc"

  vim.keymap.set("n", "gh", function() vim.lsp.buf.hover() end, opts)
  vim.keymap.set("n", "gl", function() vim.diagnostic.open_float() end, opts)
  vim.keymap.set("n", "<leader>[", function() vim.diagnostic.goto_next() end, opts)
  vim.keymap.set("n", "<leader>]", function() vim.diagnostic.goto_prev() end, opts)
  vim.keymap.set('n', 'gr', '<cmd>Telescope lsp_references<cr>', { buffer = bufnr })
  vim.keymap.set('n', 'gd', '<cmd>Telescope lsp_definitions<cr>', { buffer = bufnr })
  vim.keymap.set('n', 'gt', '<cmd>Telescope lsp_type_definitions<cr>', { buffer = bufnr })

  vim.keymap.set('n', '<leader>org', organize_imports, { buffer = bufnr })

  vim.keymap.set('n', '<leader>sel', select_ts_version, { buffer = bufnr })

  vim.keymap.set("n", "<leader>.", function() vim.lsp.buf.code_action() end, opts)
  if vim.lsp.buf.range_code_action then
    vim.keymap.set('x', '<leader>.', '<cmd>lua vim.lsp.buf.range_code_action()<cr>',{ buffer = bufnr })
  else
    vim.keymap.set('x', '<leader>.', '<cmd>lua vim.lsp.buf.code_action()<cr>', { buffer = bufnr })
  end


  vim.keymap.set("n", "<leader>rn", function() vim.lsp.buf.rename() end, opts)
end

lsp.on_attach(on_attach)


vim.diagnostic.config({
  virtual_text = true
})

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    lsp.default_setup,
  },
  opts = {
      ensure_installed = {
        "eslint-lsp@4.8.0",
        'vtsls'
      },
      automatic_installation = true
    },
})

lsp.setup_servers({
  'vtsls',
  'eslint',
  'lua_ls',
  'tailwindcss'
})

require('lspconfig').vtsls.setup({
  settings = {
    vtsls = {
      autoUseWorkspaceTsdk = true
    },
  }
})

local cmp = require('cmp')

cmp.setup({
  mapping = cmp.mapping.preset.insert({
    ['<C-u>'] = cmp.mapping.scroll_docs(-4),
    ['<C-d>'] = cmp.mapping.scroll_docs(4),
  })
})
