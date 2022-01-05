import { useCallback, MouseEvent, memo, useRef, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import debounce from 'lodash/debounce'
import { useIntl, FormattedMessage } from 'react-intl'
import { rankWith, RankedTester, uiTypeIs, schemaMatches, schemaTypeIs, and, formatIs, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { withVanillaControlProps, VanillaRendererProps } from '@jsonforms/vanilla-renderers'

import { Format, Currency, fromCentsToFloat, toCentsFromFloat, useFormatValue } from '@maps/hooks/useFormatValue'
import Slider, { Color } from '@maps/components/Slider'
import Button, { Styles, Size } from '@maps/components/Button'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import Label from '@maps/components/CustomJsonForms/components/Label'
import Description from '@maps/components/CustomJsonForms/components/Description'
import { ResultsTopSpace } from '@maps/components/SearchInput/useSearchInputProps'
import SearchInput from '@maps/components/SearchInput'

const isAddress = and(
  uiTypeIs('Control'),
  schemaTypeIs('object'),
  schemaMatches(schema => schema.hasOwnProperty('geoAddress'))
)

export const addressTester: RankedTester = rankWith(
  20,
  isAddress
)

type Props = ControlProps & VanillaRendererProps
const AddressInput = ({
  classNames,
  id,
  label,
  required,
  description,
  errors,
  data,
  schema,
  uischema,
  visible,
  config,
  path,
  handleChange,
  enabled
}: Props) => {
  const styles = useStyles()
  const { locale } = useRouter();
  if (!visible) return null

  return (
    <div className={classNames.wrapper}>
      <Label
        id={id}
        label={label}
        required={required}
        uischema={uischema}
        classNames={classNames}
      />
      <SearchInput
        locale={locale}
        buttonOutline={true}
        resultsTopSpace={ResultsTopSpace.sm}
        buttonStyle={Styles.secondary}
        inputClasses={styles.input}
      />
      <Description
        errors={errors}
        uischema={uischema}
        visible={visible}
        description={description}
      />
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(AddressInput))
