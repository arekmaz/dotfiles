local builtin = require('telescope.builtin')
-- vim.keymap.set('n', '<leader>pf', builtin.find_files, {})
-- vim.keymap.set('n', '<C-p>', builtin.git_files, {})
-- vim.keymap.set('n', '<leader>ps', function()
--   builtin.grep_string({ search = vim.fn.input("Grep > ") })
-- end)
-- vim.keymap.set('n', '<leader>vh', builtin.help_tags, {})
-- vim.keymap.set('n', '<leader>ff', builtin.live_grep, { noremap = true })

local telescope = require('telescope')

--Telescope stuff I need to import for configuration
local actions = require 'telescope.actions'
local themes = require 'telescope.themes'

-- files to ignore with `file_ignore_patterns`
local always_ignore_these = {
  'yarn%.lock',
  'package%-lock%.json',
  'pnpm%-lock%.yaml',
  'node_modules/.*',
  '.obsidian/.*',
  'deno%.lock',
  '%.git/.*',
  '%.svg',
  '%.png',
  '%.jpeg',
  '%.jpg',
  '%.ico',
  '%.webp',
  '%.avif',
  '%.heic',
  '%.mp3',
  '%.mp4',
  '%.mkv',
  '%.mov',
  '%.wav',
  '%.flv',
  '%.avi',
  '%.webm',
  '%.db',
  '%.zip',
}

local ignore_these = {
  'yarn%.lock',
  'package%-lock%.json',
  'pnpm%-lock%.yaml',
  'node_modules/.*',
  'generated/graphql%.tsx', -- scoutus project
  'generated%-gql/.*',      -- inkd project
  'zsh%-abbr/.*',
  'zsh%-autosuggestions/.*',
  'zsh%-completions/.*',
  'zsh%-syntax%-highlighting/.*',
  '.gitkeep',
  '.obsidian/.*',
  '.obsidian.vimrc',
  'deno%.lock',
  '%.git/.*',
  '%.svg',
  '%.png',
  '%.jpeg',
  '%.jpg',
  '%.ico',
  '%.webp',
  '%.avif',
  '%.heic',
  '%.mp3',
  '%.mp4',
  '%.mkv',
  '%.mov',
  '%.wav',
  '%.flv',
  '%.avi',
  '%.webm',
  '%.ttf',
  '%.otf',
  '%.woff',
  '%.woff2',
  '%.db',
  '%.zip',
  '.yarn/.*',
  'graphql%.schema%.json',
  'schema%.json',
  'go%.sum',
}

local default_picker_opts = {
  grep_string = {
    prompt_title = 'word under cursor',
  },
  live_grep = {
    file_ignore_patterns = ignore_these,
  },
  git_commits = {
    selection_strategy = 'row',
    prompt_title = 'git log',
  },
  buffers = {
    show_all_buffers = true,
    attach_mappings = function(_, local_map)
      local_map('n', 'd', actions.delete_buffer)
      local_map('i', '<c-x>', actions.delete_buffer)
      return true
    end,
  },
  git_branches = {
    attach_mappings = function(_, local_map)
      local_map('i', '<c-o>', actions.git_checkout)
      local_map('n', '<c-o>', actions.git_checkout)
      return true
    end,
    selection_strategy = 'row',
  },
  find_files = {
    find_command = { 'fd', '--hidden', '--type', 'f', '--max-results', '10000' },
    follow = true,
    hidden = true,
    no_ignore = false,
  },
  -- lsp_code_actions = themes.get_dropdown(),
  lsp_range_code_actions = themes.get_dropdown(),
}

-- TELESCOPE CONFIG
telescope.setup {
  pickers = default_picker_opts,
  defaults = {
    vimgrep_arguments = {
      'rg',
      '--color=never',
      '--no-heading',
      '--with-filename',
      '--line-number',
      '--column',
      '--smart-case',
    },
    mappings = {
      n = {
        ['<c-x>'] = false,
        ['<c-s>'] = actions.select_horizontal,
        ['<c-t>'] = actions.send_to_qflist + actions.open_qflist,
        ['<c-q>'] = require('trouble.providers.telescope').open_with_trouble,
        ['<c-c>'] = actions.close,
        ["<C-j>"] = actions.move_selection_next,
        ["<C-k>"] = actions.move_selection_previous,
      },
      i = {
        ['<c-x>'] = false,
        ['<c-s>'] = actions.select_horizontal,
        ['<c-t>'] = actions.send_to_qflist + actions.open_qflist,
        ['<c-q>'] = require('trouble.providers.telescope').open_with_trouble,
        ['<c-c>'] = actions.close,
        ['<c-k>'] = actions.delete_buffer,
        ["<C-j>"] = actions.move_selection_next,
        ["<C-k>"] = actions.move_selection_previous,
      },
    },
    color_devicons = true,
    prompt_prefix = '🔍 ',
    scroll_strategy = 'cycle',
    sorting_strategy = 'ascending',
    layout_strategy = 'flex',
    file_ignore_patterns = ignore_these,
    layout_config = {
      prompt_position = 'top',
      horizontal = {
        mirror = true,
        preview_cutoff = 100,
        preview_width = 0.5,
      },
      vertical = {
        mirror = true,
        preview_cutoff = 0.4,
      },
      flex = {
        flip_columns = 128,
      },
      height = 0.94,
      width = 0.86,
    },
  },
  extensions = {
    fzf = {
      override_generic_sorter = false,
      override_file_sorter = true,
      case_mode = 'smart_case',
    },
    file_browser = {
      -- theme = 'ivy',
      -- disables netrw and use telescope-file-browser in its place
      theme = nil,
      hijack_netrw = false,
      -- mappings = {},
    },
  },
}

require('telescope').load_extension 'fzf'
require('telescope').load_extension 'file_browser'

-- vim.keymap.set('n', '<leader>fb', function()
--   require('telescope').extensions.file_browser.file_browser {
--     preview = true,
--   }
-- end)

local builtin = function(lhs, picker, label)
  vim.keymap.set('n', lhs, function()
    require('telescope.builtin')[picker]()
  end, { desc = label })
end

local custom = function(lhs, picker, label, opts)
  opts = opts or {}
  vim.keymap.set('n', lhs, function()
    require('telescope.builtin')[picker](opts)
  end, { desc = label })
end

-- builtin('<leader>of', 'oldfiles', 'Oldfiles')
builtin('<leader>*', 'grep_string', 'Grep string')
builtin('<leader>ff', 'live_grep', 'Live grep')
-- builtin('<leader>/', 'current_buffer_fuzzy_find', 'Fuzzy find in buffer')
-- builtin('<leader>gl', 'git_commits', 'Git commits') -- git log
-- builtin('<leader>gb', 'git_branches', 'Git branches')
-- builtin('<leader>gh', 'help_tags', 'Help tags')
-- builtin('<leader>gm', 'man_pages', 'Man pages')
-- builtin('<leader>bl', 'buffers', 'List buffers')
-- builtin('<leader>ts', 'builtin', 'Telescope pickers')
-- builtin('<leader>rm', 'reloader', 'Reload module')
-- builtin('<leader>tp', 'resume', 'Previous telescope picker')
-- builtin('<leader>ps', 'lsp_dynamic_workspace_symbols', 'Project symbols')
-- builtin('<leader>ca', 'lsp_code_actions', 'Code actions')

custom('<C-p>', 'find_files', 'Find in all files', {
  file_ignore_patterns = always_ignore_these,
  no_ignore = true,
  hidden = true
})

-- find in dotfiles
custom('<leader>fd', 'find_files', 'Find in dotfiles', {
  cwd = '~/.config',
  prompt_title = 'files in dotfiles',
})

-- find in neovim config
-- custom('<leader>fn', 'find_files', 'Find neovim files', {
--   cwd = '~/.config/nvim',
--   prompt_title = 'files in neovim config',
-- })

-- grep inside of dotfiles
custom('<leader>gid', 'live_grep', 'Grep in dotfiles', {
  cwd = '~/.config',
  prompt_title = 'grep in dotfiles',
})

-- use live_grep with case sensitive enabled
-- custom('<leader>gW', 'live_grep', 'Live grep case sensitive', {
--   prompt_title = 'live_grep case sensitive',
--   vimgrep_arguments = {
--     'rg',
--     '--color=never',
--     '--no-heading',
--     '--with-filename',
--     '--line-number',
--     '--column',
--   },
-- })

-- grep inside of neovim config
-- custom('<leader>gin', 'live_grep', 'Grep in neovim files', {
--   cwd = '~/.config/nvim',
--   prompt_title = 'grep in neovim config',
-- })

-- grep inside of vim help docs
-- custom('<leader>vh', 'live_grep', 'Grep in vim help', {
--   cwd = os.getenv 'VIMRUNTIME' .. '/doc',
--   prompt_title = 'Grep in vim help docs',
-- })

-- jump to a buffer
-- custom(
--   '<leader>jb',
--   'buffers',
--   'Jump to buffer',
--   vim.tbl_deep_extend('force', themes.get_dropdown(), {
--     preview = false,
--     prompt_title = 'Jump to buffer',
--   })
-- )

-- vim-grepper-like picker with grep_string
-- vim.keymap.set('n', '<leader>rg', function()
--   require('telescope.builtin').grep_string {
--     prompt_title = 'ripgrepper',
--     search = vim.fn.input 'ripgrepper > ',
--     search_dirs = { '$PWD' },
--     use_regex = true,
--   }
-- end, { desc = 'Ripgrepper' })
