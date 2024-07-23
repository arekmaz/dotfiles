local telescope = require('telescope')

local actions = require 'telescope.actions'

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
  find_files = {
    find_command = { 'fd', '--hidden', '--type', 'f', '--max-results', '10000' },
    follow = true,
    hidden = true,
    no_ignore = false,
  },
}


telescope.setup {
  pickers = default_picker_opts,
  defaults = {
    dynamic_preview_title = true,
    cache_picker = {
      num_pickers = 100,
      limit_entries = 10000,
      ignore_empty_prompt = true,
    },
    wrap_results = true,
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
        ["<C-n>"] = actions.move_selection_next,
        ["<C-p>"] = actions.move_selection_previous,
      },
    },
    scroll_strategy = 'cycle',
    layout_strategy = 'horizontal',
    file_ignore_patterns = ignore_these,
    layout_config = {
      horizontal = {
        preview_width = 0.5,
      },

      height = 0.99,
      width = 0.99,
    },
  },
  extensions = {
    fzf = {
      override_generic_sorter = false,
      override_file_sorter = true,
      case_mode = 'smart_case',
    },
  },
}

require('telescope').load_extension 'fzf'

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

builtin('<leader>*', 'grep_string', 'Grep string')
builtin('<leader>/', 'live_grep', 'Live grep')

custom('<leader>ql', 'quickfix', 'Quickfix list', {initial_mode = 'normal'})
custom('<leader>gg', 'git_bcommits', 'File commits', {initial_mode = 'normal'})
custom('<leader>pp', 'pickers', 'Previous telescope picker', {initial_mode = 'normal'})
custom('<leader>rr', 'resume', 'Resume', {initial_mode = 'normal'})

custom('<leader><Space>', 'find_files', 'Find in all files', {
  file_ignore_patterns = always_ignore_these,
  no_ignore = true,
  hidden = true
})

