export BASH_SILENCE_DEPRECATION_WARNING=1

export PATH=/opt/homebrew/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin
# Enable the subsequent settings only in interactive sessions
case $- in
  *i*) ;;
    *) return;;
esac

export EDITOR='nvim'

alias ls='ls --color=auto'


export PATH="$PATH:$HOME/scripts"
export PATH="$PATH:/Library/TeX/texbin"

export SB_HOME="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/me"
alias sb='cd "$SB_HOME"'

[ -f ~/.fzf.bash ] && source ~/.fzf.bash

export NVM_DIR="$HOME/.nvm"
source "${NVM_DIR}/nvm.sh"

parse_git_branch() {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
export PS1="\u@\h \[\e[32m\]\w \[\e[91m\]\$(parse_git_branch)\[\e[00m\]$ "


# pnpm
export PNPM_HOME="$HOME/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

export FZF_CTRL_T_COMMAND='fd . --absolute-path --hidden --max-results=1000000 | sed "s|^$HOME|~|"'

__fzf_select__() {
  local cmd opts
  cmd="${FZF_CTRL_T_COMMAND:-"command find -L . -mindepth 1 \\( -path '*/.*' -o -fstype 'sysfs' -o -fstype 'devfs' -o -fstype 'devtmpfs' -o -fstype 'proc' \\) -prune \
    -o -type f -print \
    -o -type d -print \
    -o -type l -print 2> /dev/null | command cut -b3-"}"
  opts="--height ${FZF_TMUX_HEIGHT:-40%} --bind=ctrl-z:ignore --reverse --scheme=path ${FZF_DEFAULT_OPTS-} ${FZF_CTRL_T_OPTS-} -m"
  eval "$cmd" |
    FZF_DEFAULT_OPTS="$opts" $(__fzfcmd) "$@" |
    while read -r item; do
      if [[ "$item" == ~* ]]
      then
        printf "~%q " "${item:1}" # if starts with ~, dont escape it at the start
      else
        printf '%q ' "$item"  # escape special chars
      fi
    done
}

alias fly_push='gwip && npm version patch && git push && fly deploy'

export FZF_DEFAULT_OPTS="--preview 'bat --style=numbers --line-range :300 {}'
\ --bind ctrl-u:preview-page-up,ctrl-d:preview-page-down"
