syntax on

set noerrorbells
set tabstop=2 softtabstop=2
set shiftwidth=2
set expandtab
set smartindent
set nu
set wrap
set smartcase
set noswapfile
set nobackup
set undodir=~/.vim/undodir
set undofile
set completeopt=menuone,noinsert,noselect


set background=dark


set colorcolumn=80
highlight ColorColumn ctermbg=0 guibg=lightgrey


call plug#begin('~/.vim/plugged')

Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'


Plug 'preservim/nerdtree'
Plug 'Xuyuanp/nerdtree-git-plugin'

Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'neoclide/coc-eslint'

Plug 'sheerun/vim-polyglot'

Plug 'leafgarland/typescript-vim'
Plug 'peitalin/vim-jsx-typescript'



Plug 'tpope/vim-fugitive'
Plug 'jremmen/vim-ripgrep'
Plug 'mbbill/undotree'
Plug 'haishanh/night-owl.vim'
Plug 'prettier/vim-prettier', {
  \ 'do': 'yarn install',
  \ 'for': ['javascript', 'typescript', 'css', 'less', 'scss', 'json', 'graphql', 'markdown', 'vue', 'yaml', 'html'] }

call plug#end()

let mapleader = " "

"colorscheme gruvbox
if (has("termguicolors"))
 set termguicolors
endif


colorscheme night-owl


" Use <Tab> and <S-Tab> to navigate through popup menu
inoremap <expr> <Tab>   pumvisible() ? "\<C-n>" : "\<Tab>"
inoremap <expr> <S-Tab> pumvisible() ? "\<C-p>" : "\<S-Tab>"



nnoremap <Leader>s <Esc>:w<Enter>

" Start NERDTree and leave the cursor in it.
autocmd VimEnter * NERDTree

" Start NERDTree when Vim is started without file arguments.
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists('s:std_in') | NERDTree | endif

" Start NERDTree. If a file is specified, move the cursor to its window.
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * NERDTree | if argc() > 0 || exists("s:std_in") | wincmd p | endif

" Start NERDTree when Vim starts with a directory argument.
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists('s:std_in') |
    \ execute 'NERDTree' argv()[0] | wincmd p | enew | execute 'cd '.argv()[0] | endif





" vim-prettier
let g:prettier#autoformat_config_present = 1
let g:prettier#autoformat_require_pragma = 0
" doesn't detect `prettier.config.js` by default
let g:prettier#autoformat_config_files = get(g:, 'prettier#autoformat_config_files', [
      \'prettier.config.js',
      \'.prettierrc',
      \'.prettierrc.yml',
      \'.prettierrc.yaml',
      \'.prettierrc.js',
      \'.prettierrc.config.js',
      \'.prettierrc.json',
      \'.prettierrc.toml'])






let g:fzf_preview_window = ['right:50%', 'ctrl-/']

nnoremap <leader>j :NERDTreeToggle<Enter>

nnoremap <silent> <leader>f :wincmd p<Enter>:GFiles<Enter>
nnoremap <silent> <leader>F :FZF ~<Enter>
nnoremap <silent> <leader>ef :CocCommand eslint.executeAutofix<Enter>
