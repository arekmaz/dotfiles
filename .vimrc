set nocompatible

syntax enable
filetype plugin on

set ignorecase
set incsearch
set expandtab
set softtabstop=2

" mostly used with >> and <<
set shiftwidth=2
"
set smartindent
set ruler
"
set smarttab

set undodir=~/.vim/undodir
set undofile
"set completeopt=menuone,noinsert,noselect

set listchars=space:*,trail:*,nbsp:*,extends:>,precedes:<,tab:\|>

let g:indentLine_char_list = ['|', '¦', '┆', '┊']

set textwidth=80

set hlsearch
set incsearch
set linebreak

set wrapscan
set wrap

set ttyfast

"search recursively down
set path+=**

set number

set mouse=a

"set guicursor="i:ver80-Cursor"
set guicursor="i:ver30-Cursor"

"ignore paths while searching
let g:netrw_list_hide=netrw_gitignore#Hide()
execute 'set wildignore+='.substitute(g:netrw_list_hide.',**/.git/*,**/node_modules/*','/,','/*,','g')

let g:netrw_list_hide= '.*\.swp$,.DS_Store,*/tmp/*,*.so,*.swp,*.zip,*.git,^\.\.\=/\=$'

set guicursor+=i:ver100-iCursor


"display a list while fuzzy searching
set wildmenu

au BufWritePost *.c,*.cpp,*.h silent! !ctags -R &

set history=10000


" Tweaks for browsing
let g:netrw_banner=0        " disable annoying banner
"let g:netrw_browse_split=4  " open in prior window
let g:netrw_altv=1          " open splits to the right
let g:netrw_liststyle=3     " tree view
let g:netrw_list_hide=netrw_gitignore#Hide()


let data_dir = has('nvim') ? stdpath('data') . '/site' : '~/.vim'
if empty(glob(data_dir . '/autoload/plug.vim'))
  silent execute '!curl -fLo '.data_dir.'/autoload/plug.vim --create-dirs  https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

let g:lsp_settings_filetype_typescript = ['typescript-language-server', 'eslint-language-server']


call plug#begin('~/vimplugins')

Plug 'prabirshrestha/vim-lsp'
Plug 'mattn/vim-lsp-settings'
Plug 'arcticicestudio/nord-vim'

call plug#end()

set termguicolors

colorscheme nord

function! s:on_lsp_buffer_enabled() abort
  "setlocal omnifunc=lsp#complete
  setlocal omnifunc=lsp#omni#complete
  setlocal signcolumn=no
  if exists('+tagfunc') | setlocal tagfunc=lsp#tagfunc | endif
  nmap <buffer> gd <plug>(lsp-definition)
  nmap <buffer> gs <plug>(lsp-document-symbol-search)
  nmap <buffer> gS <plug>(lsp-workspace-symbol-search)
  nmap <buffer> gr <plug>(lsp-references)
  nmap <buffer> gi <plug>(lsp-implementation)
  nmap <buffer> gt <plug>(lsp-type-definition)
  nmap <buffer> <leader>rn <plug>(lsp-rename)
  nmap <buffer> [g <plug>(lsp-previous-diagnostic)
  nmap <buffer> ]g <plug>(lsp-next-diagnostic)
  nmap <buffer> K <plug>(lsp-hover)
  nnoremap <buffer> <expr><c-f> lsp#scroll(+4)
  nnoremap <buffer> <expr><c-d> lsp#scroll(-4)

                                                          "let g:lsp_format_sync_timeout = 1000
                                                          "autocmd! BufWritePre *.rs,*.go call execute('LspDocumentFormatSync')
endfunction

augroup lsp_install
    au!
    autocmd User lsp_buffer_enabled call s:on_lsp_buffer_enabled()
augroup END
