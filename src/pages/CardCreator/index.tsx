import React, { useState, useEffect, useRef } from 'react';
import { State } from 'reducers';
import { connect } from 'react-redux';
import { CardOptionsState } from 'reducers/cardOptions';
import { Variation, Type, Subtype, Set, Rarity, BaseSet } from 'interfaces';
import { bindActionCreators } from 'redux';
import { requestCardOptions } from 'actions';
import styles from './CardCreator.module.scss';
import CardDisplay from 'components/CardDisplay';

interface Props {
  cardOptionsState: CardOptionsState,
  requestCardOptions: () => Object,
}

const CardCreatorPage: React.FC<Props> = ({ cardOptionsState, requestCardOptions }) => {
  // Selectors
  const [supertype, setSupertype] = useState<string>('Trainer'); // Should be Pokemon
  const [type, setType] = useState<Type>();
  const [baseSet, setBaseSet] = useState<BaseSet>();
  const [set, setSet] = useState<Set>();
  const [variation, setVariation] = useState<Variation>();
  const [subtype, setSubtype] = useState<Subtype>();
  const [rarity, setRarity] = useState<Rarity>();
  const typeRef = useRef<HTMLSelectElement>(null);
  const subtypeRef = useRef<HTMLSelectElement>(null);
  const variationRef = useRef<HTMLSelectElement>(null);
  const rarityRef = useRef<HTMLSelectElement>(null);
  // Inputs
  const [name, setName] = useState<string>('Professor\'s Research');
  const [description, setDescription] = useState<string>('Each player shuffles their hand and puts it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, you draw 5 cards, and your opponent draws 4 cards.');

  useEffect(() => {
    requestCardOptions();
  }, [requestCardOptions]);

  useEffect(() => {
    setType(cardOptionsState.cardOptions.types[0]);
    setSet(cardOptionsState.cardOptions.sets[0]);
    setBaseSet(cardOptionsState.cardOptions.baseSets[0]);
    setSubtype(cardOptionsState.cardOptions.subtypes[0]);
  }, [cardOptionsState]);

  useEffect(() => {
    // Reset selected options of they are no longer available
    if(typeRef.current) {
      const { selectedIndex, options } = typeRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newType = cardOptionsState.cardOptions.types.filter((a: Type) => a.id === +value)[0];
      if(newType && newType !== type) {
        setType(newType);
      }
    } else {
      setType(undefined);
    }
    if(subtypeRef.current) {
      console.log(subtypeRef.current)
      const { selectedIndex, options } = subtypeRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newSubtype = cardOptionsState.cardOptions.subtypes.filter((a: Subtype) => a.id === +value)[0];
      if(value === 'default' || newSubtype && newSubtype !== subtype) {
        setSubtype(newSubtype);
      }
    } else {
      setSubtype(undefined);
    }
    if(variationRef.current) {
      const { selectedIndex, options } = variationRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newVariation = cardOptionsState.cardOptions.variations.filter((a: Variation) => a.id === +value)[0];
      if(newVariation && newVariation !== variation) {
        setVariation(newVariation);
      }
    } else {
      setVariation(undefined);
    }
    if(rarityRef.current) {
      const { selectedIndex, options } = rarityRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newRarity = cardOptionsState.cardOptions.rarities.filter((a: Rarity) => a.id === +value)[0];
      if(value === 'default' || newRarity && newRarity !== rarity) {
        setRarity(newRarity);
      }
    } else {
      setRarity(undefined);
    }
  }, [supertype, type, set, variation, subtype, rarity]);

  return (
    <div className={styles.wrapper}>
      <div>
        <label htmlFor='supertype' className={styles.input}>
          <span className={styles.inputLabel}>{'Supertype'}</span>
          <select id='supertype' name='supertype' className={styles.inputField} onChange={e => setSupertype(e.currentTarget.value)}>
            <option value={'Pokemon'}>{'Pokémon'}</option>
            <option value={'Trainer'}>{'Trainer'}</option>
            <option value={'Energy'}>{'Energy'}</option>
          </select>
        </label>
        <label htmlFor='type' className={styles.input}>
          <span className={styles.inputLabel}>{'Type'}</span>
          <select ref={typeRef} id='type' name='type' className={styles.inputField}
            onChange={e => setType(cardOptionsState.cardOptions.types.filter((a: Type) => a.id === +e.currentTarget.value)[0])}>
            {cardOptionsState.cardOptions.types.map((value: Type, i: number) => {
              if(supertype !== value.supertype) {
                return false;
              } else {
                return <option disabled={supertype !== value.supertype} value={value.id} key={i}>{value.name}</option>;
              }
            })}
          </select>
        </label>
        <label htmlFor='baseSet' className={styles.input}>
          <span className={styles.inputLabel}>{'Base Set'}</span>
          <select id='baseSet' name='baseSet' className={styles.inputField}
            onChange={e => setBaseSet(cardOptionsState.cardOptions.baseSets.filter((a: BaseSet) => a.id === +e.currentTarget.value)[0])}>
            {cardOptionsState.cardOptions.baseSets.map((value: BaseSet, i: number) =>
              <option value={value.id} key={i}>{value.name}</option>
            )}
          </select>
        </label>
        {type?.hasSubtypes && supertype !== 'Energy' &&
          <label htmlFor='subtype' className={styles.input}>
            <span className={styles.inputLabel}>{'Subtype'}</span>
            <select ref={subtypeRef} id='subtype' name='subtype' className={styles.inputField}
              onChange={e => setSubtype(cardOptionsState.cardOptions.subtypes.filter((a: Subtype) => a.id === +e.currentTarget.value)[0])}>
              {type?.subtypeOptional && <option value={'default'}>{'Default'}</option>}
              {cardOptionsState.cardOptions.subtypes.map((value: Subtype, i: number) => {
                if(!value.types.includes(type?.id || 0)) {
                  return false;
                } else {
                  return <option value={value.id} key={i}>{value.name}</option>;
                }
              })}
            </select>
          </label>
        }
        {subtype?.hasVariations && supertype !== 'Energy' && supertype !== 'Trainer' &&
          <label htmlFor='variation' className={styles.input}>
            <span className={styles.inputLabel}>{'Variation'}</span>
            <select ref={variationRef} id='variation' name='variation' className={styles.inputField}
              onChange={e => setVariation(cardOptionsState.cardOptions.variations.filter((a: Variation) => a.id === +e.currentTarget.value)[0])}>
              {cardOptionsState.cardOptions.variations.map((value: Variation, i: number) => {
                if(!value.subtypes.includes(subtype?.id || 0)) {
                  return false;
                } else {
                  return <option value={value.id} key={i}>{value.name}</option>;
                }
              })}
            </select>
          </label>
        }
        {supertype !== 'Energy' && supertype !== 'Trainer' &&
          <label htmlFor='rarity' className={styles.input}>
            <span className={styles.inputLabel}>{'Rarity'}</span>
            <select ref={rarityRef} id='rarity' name='rarity' className={styles.inputField}
              onChange={e => setRarity(cardOptionsState.cardOptions.rarities.filter((a: Rarity) => a.id === +e.currentTarget.value)[0])}>
              <option value={'default'}>{'Default'}</option>
              {cardOptionsState.cardOptions.rarities.map((value: Rarity, i: number) => {
                const includesType: boolean = value.types.includes(type?.id || 0);
                const includesSubtype: boolean = value.subtypes.includes(subtype?.id || 0);
                const includesVariation: boolean = value.variations.includes(variation?.id || 0);
                if((includesType && (includesSubtype || !subtype) && (includesVariation || !variation)
                  || (includesSubtype && (includesVariation || !variation))
                  || includesVariation)) {
                  return <option value={value.id} key={i}>{value.name}</option>;
                } else {
                  return false;
                }
              })}
            </select>
          </label>
        }
        <label htmlFor='set' className={styles.input}>
          <span className={styles.inputLabel}>{'Set'}</span>
          <select id='set' name='set' className={styles.inputField}
            onChange={e => setSet(cardOptionsState.cardOptions.types.filter((a: Set) => a.id === +e.currentTarget.value)[0])}>
            {cardOptionsState.cardOptions.sets.map((value: Set, i: number) =>
              <option value={value.id} key={i}>{value.name}</option>
            )}
          </select>
        </label>
        <label htmlFor='name' className={styles.input}>
          <span className={styles.inputLabel}>{'Name'}</span>
          <input type='text' id='name' name='name' className={styles.inputField}
            value={name} onChange={e => setName(e.currentTarget.value)} />
        </label>
        <label htmlFor='description' className={styles.input}>
          <span className={styles.inputLabel}>{'Description'}</span>
          <textarea id='description' name='description' className={styles.inputField}
            value={description} onChange={e => setDescription(e.currentTarget.value)}></textarea>
        </label>
      </div>
      <CardDisplay card={{
        baseSet,
        supertype,
        type,
        set,
        variation,
        subtype,
        rarity,
        name,
        description,
      }} />
    </div>
  )
}

const mapStateToProps = (state: State) => ({ cardOptionsState: state.cardOptions });
const mapDispatchToProps = (dispatch: any) => bindActionCreators({ requestCardOptions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CardCreatorPage);
