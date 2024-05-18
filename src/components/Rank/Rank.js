import React from 'react';

class Rank extends React.Component {


    render() {

        const {name, entries} = this.props

        return (
            <div>
                <div className='f3 white'>
                    {`${name} your current entry count is ....`}
                </div>
                <div className='f1 white'>
                    {`${entries}`}
                </div>
            </div>
        );
    }

}

export default Rank;