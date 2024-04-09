// import React from 'react';
// import PropTypes from 'prop-types';

// const Page = ({page=10}) => {
//     return (
//         <div>
//            props的默认值: {page}
//         </div>
//     );
// };

// Page.propTypes = {
    
// };

// export default Page;

import React, { Component } from 'react';

class Page extends Component {

static defaultProps = {
    page:10,
}

    render() {
        return (
            <div>
                props的默认值：{this.props.page}
            </div>
        );
    }
}

export default Page;