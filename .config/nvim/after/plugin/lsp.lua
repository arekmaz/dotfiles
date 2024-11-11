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
  -- https://lsp-zero.netlify.app/docs/language-server-configuration.html
  lsp.default_keymaps({ buffer = bufnr })

  local opts = { buffer = bufnr, remap = false }

  vim.opt.makeprg = "npx tsc"
  vim.cmd('compiler tsc')

  vim.keymap.set("n", "<leader>l", function() vim.diagnostic.open_float() end, opts)

  vim.keymap.set("n", "<leader>[", function() vim.diagnostic.goto_next() end, opts)

  vim.keymap.set("n", "<leader>]", function() vim.diagnostic.goto_prev() end, opts)

  vim.keymap.set('n', '<leader>o', organize_imports, { buffer = bufnr })

  vim.keymap.set('n', '<leader>s', select_ts_version, { buffer = bufnr })

  vim.keymap.set("n", "<leader>.", function() vim.lsp.buf.code_action() end, opts)

  vim.keymap.set("n", "<leader>r", function() vim.lsp.buf.rename() end, opts)

  if vim.lsp.buf.range_code_action then
    vim.keymap.set('x', '<leader>.', '<cmd>lua vim.lsp.buf.range_code_action()<cr>',{ buffer = bufnr })
  else
    vim.keymap.set('x', '<leader>.', '<cmd>lua vim.lsp.buf.code_action()<cr>', { buffer = bufnr })
  end


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
