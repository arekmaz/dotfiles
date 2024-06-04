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


local on_attach = function(client, bufnr)
  lsp.default_keymaps({ buffer = bufnr })

  local opts = { buffer = bufnr, remap = false }

  vim.keymap.set("n", "gh", function() vim.lsp.buf.hover() end, opts)
  vim.keymap.set("n", "gl", function() vim.diagnostic.open_float() end, opts)
  vim.keymap.set("n", "<leader>[", function() vim.diagnostic.goto_next() end, opts)
  vim.keymap.set("n", "<leader>]", function() vim.diagnostic.goto_prev() end, opts)
  vim.keymap.set("n", "<leader>.", function() vim.lsp.buf.code_action() end, opts)
  vim.keymap.set('n', 'gr', '<cmd>Telescope lsp_references<cr>', { buffer = bufnr })
  vim.keymap.set('n', 'gd', '<cmd>Telescope lsp_definitions<cr>', { buffer = bufnr })
  vim.keymap.set('n', '<leader>org', '<cmd>OrganizeImports<cr>', { buffer = bufnr })

  vim.keymap.set("n", "<leader>rn", function() vim.lsp.buf.rename() end, opts)
end

lsp.on_attach(on_attach)


vim.diagnostic.config({
  virtual_text = true
})

local function organize_imports()
  local params = {
    command = "typescript.organizeImports",
    arguments = { vim.api.nvim_buf_get_name(0) },
    title = ""
  }
  vim.lsp.buf.execute_command(params)
end

require('lspconfig').vtsls.setup {
  on_attach = function(client, bufnr)
    vim.cmd('compiler tsc')
    vim.opt.makeprg = "npx tsc"
  end,
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

local cmp = require('cmp')

cmp.setup({
  mapping = cmp.mapping.preset.insert({
    ['<C-u>'] = cmp.mapping.scroll_docs(-4),
    ['<C-d>'] = cmp.mapping.scroll_docs(4),
  })
})
