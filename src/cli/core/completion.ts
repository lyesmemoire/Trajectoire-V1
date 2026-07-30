/**
 * Shell Autocompletion for Blueprint CLI
 * Generates completion scripts for bash, zsh, fish, and powershell
 */

import { Command } from 'commander';

export function generateBashCompletion(program: Command): string {
  const commands = program.commands.map(cmd => cmd.name()).join(' ');
  
  return `_blueprint_completion() {
    local cur prev words cword
    _init_completion || return
    
    if [[ \${cur} == * ]] ; then
        COMPREPLY=( \$(compgen -W "${commands}" -- \${cur}) )
        return 0
    fi
    
    case \${prev} in
        blueprint)
            COMPREPLY=( \$(compgen -W "${commands}" -- \${cur}) )
            ;;
        init)
            COMPREPLY=( \$(compgen -W "--name --template --directory --force --help" -- \${cur}) )
            ;;
        compile)
            COMPREPLY=( \$(compgen -W "--input --output --optimize --emit-ir --emit-bytecode --emit-package --target --help" -- \${cur}) )
            ;;
        build)
            COMPREPLY=( \$(compgen -W "--input --output --watch --optimize --help" -- \${cur}) )
            ;;
        run)
            COMPREPLY=( \$(compgen -W "--package --entry --debug --args --help" -- \${cur}) )
            ;;
        graph)
            COMPREPLY=( \$(compgen -W "--type --format --output --filter --help" -- \${cur}) )
            ;;
        trace)
            COMPREPLY=( \$(compgen -W "--output --format --filter --duration --help" -- \${cur}) )
            ;;
        debug)
            COMPREPLY=( \$(compgen -W "--port --host --breakpoints --attach --help" -- \${cur}) )
            ;;
        benchmark)
            COMPREPLY=( \$(compgen -W "--output --filter --iterations --warmup --help" -- \${cur}) )
            ;;
        doctor)
            COMPREPLY=( \$(compgen -W "--output --fix --check --help" -- \${cur}) )
            ;;
        *)
            ;;
    esac
}

complete -F _blueprint_completion blueprint
`;
}

export function generateZshCompletion(program: Command): string {
  const commands = program.commands.map(cmd => cmd.name()).join(' ');
  
  return `#compdef blueprint

_blueprint() {
    local -a commands
    commands=(
        ${program.commands.map(cmd => `"${cmd.name()}:${cmd.description()}"`).join('\n        ')}
    )

    if (( CURRENT == 2 )); then
        _describe 'command' commands
    else
        case $words[2] in
            init)
                _arguments \\
                    '--name[Project name]' \\
                    '--template[Template to use]' \\
                    '--directory[Output directory]' \\
                    '--force[Force overwrite]' \\
                    '--help[Show help]'
                ;;
            compile)
                _arguments \\
                    '--input[Input file path]' \\
                    '--output[Output file path]' \\
                    '--optimize[Enable optimizations]' \\
                    '--emit-ir[Emit IR]' \\
                    '--emit-bytecode[Emit bytecode]' \\
                    '--emit-package[Emit package]' \\
                    '--target[Target platform]' \\
                    '--help[Show help]'
                ;;
            build)
                _arguments \\
                    '--input[Input directory]' \\
                    '--output[Output directory]' \\
                    '--watch[Watch for changes]' \\
                    '--optimize[Enable optimizations]' \\
                    '--help[Show help]'
                ;;
            run)
                _arguments \\
                    '--package[Package path]' \\
                    '--entry[Entry point name]' \\
                    '--debug[Enable debugging]' \\
                    '--args[Arguments to pass]' \\
                    '--help[Show help]'
                ;;
            graph)
                _arguments \\
                    '--type[Graph type]' \\
                    '--format[Output format]' \\
                    '--output[Output file]' \\
                    '--filter[Filter nodes]' \\
                    '--help[Show help]'
                ;;
            trace)
                _arguments \\
                    '--output[Output file]' \\
                    '--format[Output format]' \\
                    '--filter[Event filter]' \\
                    '--duration[Trace duration]' \\
                    '--help[Show help]'
                ;;
            debug)
                _arguments \\
                    '--port[Debug port]' \\
                    '--host[Debug host]' \\
                    '--breakpoints[Breakpoints file]' \\
                    '--attach[Attach to process]' \\
                    '--help[Show help]'
                ;;
            benchmark)
                _arguments \\
                    '--output[Output file]' \\
                    '--filter[Benchmark filter]' \\
                    '--iterations[Number of iterations]' \\
                    '--warmup[Warmup iterations]' \\
                    '--help[Show help]'
                ;;
            doctor)
                _arguments \\
                    '--output[Output file]' \\
                    '--fix[Auto-fix issues]' \\
                    '--check[Specific checks]' \\
                    '--help[Show help]'
                ;;
            *)
                _files
                ;;
        esac
    fi
}

_blueprint "$@"
`;
}

export function generateFishCompletion(program: Command): string {
  const commands = program.commands.map(cmd => cmd.name()).join(' ');
  
  return `function __blueprint_no_subcommand
    for cmd in ${commands}
        if contains (commandline -opc) $cmd
            return 1
        end
    end
    return 0
end

complete -c blueprint -n __blueprint_no_subcommand -f -a "${commands}" -d "Blueprint command"

complete -c blueprint -n __fish_use_subcommand -a init -d "Initialize a new Blueprint project"
complete -c blueprint -n __fish_use_subcommand -a compile -d "Compile Blueprint DSL to bytecode"
complete -c blueprint -n __fish_use_subcommand -a build -d "Build a Blueprint package"
complete -c blueprint -n __fish_use_subcommand -a run -d "Run a Blueprint program"
complete -c blueprint -n __fish_use_subcommand -a graph -d "Generate graphs"
complete -c blueprint -n __fish_use_subcommand -a trace -d "Enable runtime tracing"
complete -c blueprint -n __fish_use_subcommand -a debug -d "Attach debugger program"
complete -c blueprint -n __fish_use_subcommand -a benchmark -d "Run benchmarks"
complete -c blueprint -n __fish_use_subcommand -a doctor -d "Check system health"

# Init options
complete -c blueprint -n __fish_seen_subcommand_from init -l name -d "Project name"
complete -c blueprint -n __fish_seen_subcommand_from init -l template -d "Template to use"
complete -c blueprint -n __fish_seen_subcommand_from init -l directory -d "Output directory"
complete -c blueprint -n __fish_seen_subcommand_from init -l force -d "Force overwrite"

# Compile options
complete -c blueprint -n __fish_seen_subcommand_from compile -l input -d "Input file path"
complete -c blueprint -n __fish_seen_subcommand_from compile -l output -d "Output file path"
complete -c blueprint -n __fish_seen_subcommand_from compile -l optimize -d "Enable optimizations"
complete -c blueprint -n __fish_seen_subcommand_from compile -l emit-ir -d "Emit IR"
complete -c blueprint -n __fish_seen_subcommand_from compile -l emit-bytecode -d "Emit bytecode"
complete -c blueprint -n __fish_seen_subcommand_from compile -l emit-package -d "Emit package"
complete -c blueprint -n __fish_seen_subcommand_from compile -l target -d "Target platform"

# Build options
complete -c blueprint -n __fish_seen_subcommand_from build -l input -d "Input directory"
complete -c blueprint -n __fish_seen_subcommand_from build -l output -d "Output directory"
complete -c blueprint -n __fish_seen_subcommand_from build -l watch -d "Watch for changes"
complete -c blueprint -n __fish_seen_subcommand_from build -l optimize -d "Enable optimizations"

# Run options
complete -c blueprint -n __fish_seen_subcommand_from run -l package -d "Package path"
complete -c blueprint -n __fish_seen_subcommand_from run -l entry -d "Entry point name"
complete -c blueprint -n __fish_seen_subcommand_from run -l debug -d "Enable debugging"
complete -c blueprint -n __fish_seen_subcommand_from run -l args -d "Arguments to pass"

# Graph options
complete -c blueprint -n __fish_seen_subcommand_from graph -l type -d "Graph type"
complete -c blueprint -n __fish_seen_subcommand_from graph -l format -d "Output format"
complete -c blueprint -n __fish_seen_subcommand_from graph -l output -d "Output file"
complete -c blueprint -n __fish_seen_subcommand_from graph -l filter -d "Filter nodes"

# Trace options
complete -c blueprint -n __fish_seen_subcommand_from trace -l output -d "Output file"
complete -c blueprint -n __fish_seen_subcommand_from trace -l format -d "Output format"
complete -c blueprint -n __fish_seen_subcommand_from trace -l filter -d "Event filter"
complete -c blueprint -n __fish_seen_subcommand_from trace -l duration -d "Trace duration"

# Debug options
complete -c blueprint -n __fish_seen_subcommand_from debug -l port -d "Debug port"
complete -c blueprint -n __fish_seen_subcommand_from debug -l host -d "Debug host"
complete -c blueprint -n __fish_seen_subcommand_from debug -l breakpoints -d "Breakpoints file"
complete -c blueprint -n __fish_seen_subcommand_from debug -l attach -d "Attach to process"

# Benchmark options
complete -c blueprint -n __fish_seen_subcommand_from benchmark -l output -d "Output file"
complete -c blueprint -n __fish_seen_subcommand_from benchmark -l filter -d "Benchmark filter"
complete -c blueprint -n __fish_seen_subcommand_from benchmark -l iterations -d "Number of iterations"
complete -c blueprint -n __fish_seen_subcommand_from benchmark -l warmup -d "Warmup iterations"

# Doctor options
complete -c blueprint -n __fish_seen_subcommand_from doctor -l output -d "Output file"
complete -c blueprint -n __fish_seen_subcommand_from doctor -l fix -d "Auto-fix issues"
complete -c blueprint -n __fish_seen_subcommand_from doctor -l check -d "Specific checks"
`;
}

export function generatePowerShellCompletion(program: Command): string {
  const commands = program.commands.map((cmd: any) => cmd.name()).join(' ');
  
  return `Register-ArgumentCompleter -Native -CommandName blueprint -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $commands = @(${program.commands.map((cmd: any) => `"${cmd.name()}"`).join(', ')})
    
    if ($commandAst.CommandElements.Count -eq 1) {
        $commands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
        }
    } else {
        $command = $commandAst.CommandElements[1].Value
        
        switch ($command) {
            "init" {
                $options = @("--name", "--template", "--directory", "--force", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "compile" {
                $options = @("--input", "--output", "--optimize", "--emit-ir", "--emit-bytecode", "--emit-package", "--target", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "build" {
                $options = @("--input", "--output", "--watch", "--optimize", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "run" {
                $options = @("--package", "--entry", "--debug", "--args", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "graph" {
                $options = @("--type", "--format", "--output", "--filter", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "trace" {
                $options = @("--output", "--format", "--filter", "--duration", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "debug" {
                $options = @("--port", "--host", "--breakpoints", "--attach", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "benchmark" {
                $options = @("--output", "--filter", "--iterations", "--warmup", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
            "doctor" {
                $options = @("--output", "--fix", "--check", "--help")
                $options | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, "ParameterValue", $_)
                }
            }
        }
    }
}
`;
}
