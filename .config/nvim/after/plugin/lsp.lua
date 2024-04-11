local lsp = require("lsp-zero")

lsp.preset("recommended")

-- lsp.ensure_installed({
--   'tsserver',
--   'lua_ls',
--   'eslint',
--   'jsonls',
--   'tailwindcss'
--   -- 'rust_analyzer',
-- })

-- Fix Undefined global 'vim'
-- lsp.nvim_workspace()

vim.lsp.set_log_level("debug")

lsp.set_preferences({
  suggest_lsp_servers = false,
  sign_icons = {
    error = 'E',
    warn = 'W',
    hint = 'H',
    info = 'I'
  }
})


local on_attach = function(client, bufnr)
  lsp.default_keymaps({ buffer = bufnr })
  client.server_capabilities.semanticTokensProvider = nil

  local opts = { buffer = bufnr, remap = false }
  --
  -- vim.keymap.set("n", "gd", function() vim.lsp.buf.definition() end, opts)
  vim.keymap.set("n", "gh", function() vim.lsp.buf.hover() end, opts)
  -- vim.keymap.set("n", "<leader>vws", function() vim.lsp.buf.workspace_symbol() end, opts)
  vim.keymap.set("n", "<leader>vd", function() vim.diagnostic.open_float() end, opts)
  vim.keymap.set("n", "<leader>[", function() vim.diagnostic.goto_next() end, opts)
  vim.keymap.set("n", "<leader>]", function() vim.diagnostic.goto_prev() end, opts)
  vim.keymap.set("n", "<leader>.", function() vim.lsp.buf.code_action() end, opts)
  -- vim.keymap.set("n", "<leader>vca", function() vim.lsp.buf.code_action() end, opts)
  -- vim.keymap.set("n", "<leader>vrr", function() vim.lsp.buf.references() end, opts)
  vim.keymap.set('n', 'gr', '<cmd>Telescope lsp_references<cr>', { buffer = bufnr })
  vim.keymap.set('n', '<leader>org', '<cmd>OrganizeImports<cr>', { buffer = bufnr })

  vim.keymap.set("n", "<leader>vrn", function() vim.lsp.buf.rename() end, opts)
  -- vim.keymap.set("i", "<C-h>", function() vim.lsp.buf.signature_help() end, opts)
end

lsp.on_attach(on_attach)


vim.diagnostic.config({
  virtual_text = true
})

local function organize_imports()
  local params = {
    command = "_typescript.organizeImports",
    arguments = { vim.api.nvim_buf_get_name(0) },
    title = ""
  }
  vim.lsp.buf.execute_command(params)
end

require('lspconfig').tsserver.setup {
  --  cmd = {
  -- "typescript-language-server", "--stdio",
  --  }

  commands = {
    OrganizeImports = {
      organize_imports,
      description = "Organize Imports"
    }
  }
}

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    lsp.default_setup,
  },
})

lsp.setup_servers({
  'tsserver',
  'eslint',
  'lua_ls',
  'tailwindcss'
})


local cmp = require('cmp')
local cmp_action = require('lsp-zero').cmp_action()

cmp.setup({
  mapping = cmp.mapping.preset.insert({
    -- `Enter` key to confirm completion
    ['<CR>'] = cmp.mapping.confirm({ select = false }),

    -- Ctrl+Space to trigger completion menu
    ['<C-Space>'] = cmp.mapping.complete(),

    -- Navigate between snippet placeholder
    ['<C-f>'] = cmp_action.luasnip_jump_forward(),
    ['<C-b>'] = cmp_action.luasnip_jump_backward(),

    -- Scroll up and down in the completion documentation
    ['<C-u>'] = cmp.mapping.scroll_docs(-4),
    ['<C-d>'] = cmp.mapping.scroll_docs(4),
  })
})
