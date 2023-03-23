import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import globalBlockRegistry from 'core/helpers/blockRegistry'
import blockRegistry from 'Config/blocks'
import { keys } from 'core/bucket_keys'
import isEmpty from 'lodash/isEmpty'
import Block from 'core/blocks/block/BlockVariant'
import get from 'lodash/get'
import { usePageContext } from 'core/helpers/pageContext'
import { BlockError } from 'core/blocks/block/BlockError'

// const getDefaultDataPath = ({ survey, edition, section, question }) =>
//     `dataAPI.surveys.${survey.id}.${edition.id}.${section.id}.${question.id}.responses.${
//         question.allEditions ? 'all_editions' : 'current_edition'
//     }`

const getDefaultDataPath = ({ survey, edition, section, question }) =>
    `dataAPI.surveys.${survey.id}.${edition.id}.${section.id}.${question.id}`

const BlockSwitcher = ({ pageData, block, index, ...props }) => {
    const pageContext = usePageContext()

    const { currentSurvey, currentEdition } = pageContext
    const dataPath =
        block.dataPath ||
        getDefaultDataPath({
            survey: currentSurvey,
            edition: currentEdition,
            section: { id: pageContext.id },
            question: block
        })

    let blockData = dataPath && get(pageData, dataPath)
    const [customData, setCustomData] = useState()
    // console.log(block)
    // console.log(pageData)
    // console.log(dataPath)
    // console.log(blockData)
    let blockKeys = block.keysPath && get(pageData, block.keysPath)
    const { id, blockType, hidden } = block
    if (!blockRegistry[blockType]) {
        return (
            <BlockError
                block={block}
                message={`Missing Block Component! Block ID: ${id} | type: ${blockType}`}
            />
        )
    }
    const BlockComponent = blockRegistry[blockType]
    if (block.dataPath && (!blockData || blockData === null || isEmpty(blockData))) {
        return (
            <BlockError
                block={block}
                message={`No available data for block ${id} | path: ${block.dataPath} | type: ${blockType}`}
            >
                <textarea readOnly value={JSON.stringify(pageData, undefined, 2)} />
            </BlockError>
        )
    }

    const blockEntity = block.entityPath && get(pageData, block.entityPath)

    const customChart = customData && (
        <BlockComponent
            block={{ ...block, entity: blockEntity, chartOnly: true }}
            pageData={pageData}
            data={customData}
            entity={blockEntity}
            keys={blockKeys}
            index={index}
            context={pageContext}
            {...props}
        />
    )

    return (
        <BlockComponent
            block={{ ...block, entity: blockEntity, setCustomData, customData, customChart }}
            pageData={pageData}
            data={blockData}
            entity={blockEntity}
            keys={blockKeys}
            index={index}
            context={pageContext}
            {...props}
        />
    )
}

export default BlockSwitcher
