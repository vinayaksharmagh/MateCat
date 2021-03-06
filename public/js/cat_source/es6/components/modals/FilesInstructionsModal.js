import CommonUtils from '../../utils/commonUtils';
import TextUtils from '../../utils/textUtils';
import showdown from 'showdown';
import xss from 'xss';
class FilesInstructionsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.instructions =
        //     '**Client:** Product - Rider  \n' +
        //     '**Domain:** UI  \n' +
        //     '**Note:** Link to file a query: http://t.uber.com/riderq Rider  \n' +
        //     '            Screen Search: https://docs.google.com/document/d/19Dk92t9NXdN.';
    }

    createFileList() {
        const converter = new showdown.Converter();
        const { currentFile } = this.props;
        return this.props.files.map((file) => {
            const currentClass = currentFile && currentFile === file.id ? 'current active' : '';
            if (file.instructions) {
                return (
                    <div key={'file' + file.id}>
                        <div className={'title ' + currentClass}>
                            <i className="dropdown icon" />
                            <span
                                className={
                                    'fileFormat ' +
                                    CommonUtils.getIconClass(
                                        file.file_name.split('.')[file.file_name.split('.').length - 1]
                                    )
                                }
                            >
                                {file.file_name}
                            </span>
                            {currentFile && currentFile === file.id && (
                                <div className="current-icon">
                                    <CurrentIcon />
                                </div>
                            )}
                        </div>
                        <div className={'content ' + currentClass}>
                            <div
                                className="transition"
                                dangerouslySetInnerHTML={{
                                    __html: xss(converter.makeHtml(
                                        TextUtils.replaceUrl(file.instructions.replace(/[ ]*\n/g, '<br>\n')))
                                    ),
                                }}
                            />
                        </div>
                    </div>
                );
            } else {
                return '';
            }
        });
    }

    createSingleFile() {
        const converter = new showdown.Converter();
        converter.setOption('simpleLineBreaks', false);
        const file = this.props.files.find((file) => file.id === this.props.currentFile);
        return (
            <div className="matecat-modal-text">
                <div className={'description'}>
                    <p>Please read the following notes and references carefully:</p>
                </div>
                <div className="instructions-container">
                    <p
                        dangerouslySetInnerHTML={{
                            __html: xss(converter.makeHtml(
                                TextUtils.replaceUrl(file.instructions.replace(/[ ]*\n/g, '<br>\n')))
                            ),
                        }}
                    />
                </div>
            </div>
        );
    }

    componentDidMount() {
        $(this.accordion).accordion();
    }

    render() {
        return (
            <div className="instructions-modal">
                <div className="matecat-modal-middle">
                    {this.props.showCurrent ? (
                        this.createSingleFile()
                    ) : (
                        <div className="matecat-modal-text">
                            <h2>Files instructions</h2>
                            <div
                                className="ui styled fluid accordion"
                                ref={(acc) => {
                                    this.accordion = acc;
                                }}
                            >
                                {this.createFileList()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default FilesInstructionsModal;

const CurrentIcon = () => {
    return (
        <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12">
            <path
                fill="#777"
                fillRule="evenodd"
                stroke="none"
                strokeWidth="1"
                d="M15.735.265a.798.798 0 00-1.13 0L5.04 9.831 1.363 6.154a.798.798 0 00-1.13 1.13l4.242 4.24a.799.799 0 001.13 0l10.13-10.13a.798.798 0 000-1.129z"
                transform="translate(-266 -10) translate(266 8) translate(0 2)"
            />
        </svg>
    );
};
