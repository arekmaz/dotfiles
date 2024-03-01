require("neo-tree").setup({
  close_if_last_window = true,
  filesystem = {
    follow_current_file = {
      enabled = true,          -- This will find and focus the file in the active buffer every time
      --               -- the current file is changed while the tree is open.
      leave_dirs_open = false, -- `false` closes auto expanded dirs, such as with `:Neotree reveal`
    },

    filtered_items = {
      visible = true,
      hide_dotfiles = false,
      hide_gitignored = false,
      never_show = { -- remains hidden even if visible is toggled to true, this overrides always_show
        ".DS_Store",
        "thumbs.db"
      }
    }
  },
  -- window = {
  --   mappings = {
  --     ["<cr>"] = { "show_help", nowait = false, config = { title = "Order by", prefix_key = "o" } },
  --     ["o"] = 'open'
  --   }
  -- },
})


vim.keymap.set("n", "<C-n>", "<CMD>:Neotree toggle<CR>")
