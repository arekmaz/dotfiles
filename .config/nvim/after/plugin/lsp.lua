local lsp = require("lsp-zero")


local on_attach = function(client, bufnr)
  -- https://lsp-zero.netlify.app/docs/language-server-configuration.html
  lsp.default_keymaps({ buffer = bufnr })

  local opts = { buffer = bufnr, remap = false }

  vim.keymap.set("n", "<leader>l", function() vim.diagnostic.open_float() end, opts)

  vim.keymap.set("n", "<leader>[", function() vim.diagnostic.goto_next() end, opts)

  vim.keymap.set("n", "<leader>]", function() vim.diagnostic.goto_prev() end, opts)

  vim.keymap.set("n", "<leader>.", function() vim.lsp.buf.code_action() end, opts)

  vim.keymap.set("n", "<leader>r", function() vim.lsp.buf.rename() end, opts)

  if vim.lsp.buf.range_code_action then
    vim.keymap.set('x', '<leader>.', '<cmd>lua vim.lsp.buf.range_code_action()<cr>',{ buffer = bufnr })
  else
    vim.keymap.set('x', '<leader>.', '<cmd>lua vim.lsp.buf.code_action()<cr>', { buffer = bufnr })
  end

end

lsp.on_attach(on_attach)

require('mason').setup({})

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

require('lspconfig').vtsls.setup({
  settings = {
    vtsls = {
      autoUseWorkspaceTsdk = true
    },
  },
  on_attach = function(client, bufnr)
      vim.cmd('compiler tsc')
      vim.opt.makeprg = "npx tsc"
      vim.keymap.set('n', '<leader>o', organize_imports, { buffer = bufnr })
      vim.keymap.set('n', '<leader>s', select_ts_version, { buffer = bufnr })
  end,
})
