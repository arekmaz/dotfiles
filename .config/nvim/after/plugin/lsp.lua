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

-- Mason Lspconfig:
-- register a setup hook with lspconfig that ensures servers installed with mason.nvim are set up with the necessary configuration
-- provide extra convenience APIs such as the :LspInstall command
-- allow you to (i) automatically install, and (ii) automatically set up a predefined list of servers
-- translate between lspconfig server names and mason.nvim package names (e.g. lua_ls <-> lua-language-server)
require("mason-lspconfig").setup({
    -- A list of servers to automatically install if they're not already installed. Example: { "rust_analyzer@nightly", "lua_ls" }
    -- This setting has no relation with the `automatic_installation` setting.
    ---@type string[]
    ensure_installed = {
      "eslint", "vtsls", "lua_ls", "tailwindcss"
    },

    -- Whether servers that are set up (via lspconfig) should be automatically installed if they're not already installed.
    -- This setting has no relation with the `ensure_installed` setting.
    -- Can either be:
    --   - false: Servers are not automatically installed.
    --   - true: All servers set up via lspconfig are automatically installed.
    --   - { exclude: string[] }: All servers set up via lspconfig, except the ones provided in the list, are automatically installed.
    --       Example: automatic_installation = { exclude = { "rust_analyzer", "solargraph" } }
    ---@type boolean
    automatic_installation = true,
})

local function organize_imports()
  local params = {
    command = "typescript.organizeImports",
    arguments = { vim.api.nvim_buf_get_name(0) },
    title = ""
  }
  vim.lsp.buf.execute_command(params)
  vim.cmd('write')
end

local function select_ts_version()
  local params = {
    command = "typescript.selectTypeScriptVersion",
    arguments = { vim.api.nvim_buf_get_name(0) },
    title = ""
  }
  vim.lsp.buf.execute_command(params)
end

-- :h mason-lspconfig-automatic-server-setup
require("mason-lspconfig").setup_handlers {
  -- The first entry (without a key) will be the default handler
  -- and will be called for each installed server that doesn't have
  -- a dedicated handler.
  function (server_name) -- default handler (optional)
      require("lspconfig")[server_name].setup {}
  end,
  -- Next, you can provide a dedicated handler for specific servers.
  -- For example, a handler override for the `rust_analyzer`:
  ["vtsls"] = function ()
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
  end

}





